import os
import requests
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from deep_translator import GoogleTranslator

load_dotenv()

app = FastAPI(title="MangaFinder API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, specify frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SAUCENAO_API_KEY = os.getenv("SAUCENAO_API_KEY")

# --- Pydantic Models ---

class Author(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    mal_id: Optional[int] = None
    image_url: Optional[str] = None

class RelatedWork(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    url: Optional[str] = None

class OtherMatch(BaseModel):
    titulo: Optional[str] = None
    similarity: float
    portada_url: Optional[str] = None

class MangaSearchResult(BaseModel):
    found: bool
    similarity_confidence: float = 0.0
    titulo: Optional[str] = None
    capitulo_estimado: Optional[str] = None
    pagina_estimada: Optional[str] = None
    sinopsis: Optional[str] = None
    sinopsis_en: Optional[str] = None
    sinopsis_es: Optional[str] = None
    portada_url: Optional[str] = None
    match_image_url: Optional[str] = None
    otras_coincidencias: List[OtherMatch] = []
    autores: List[Author] = []
    otras_obras: List[RelatedWork] = []
    warning: Optional[str] = None
    message: Optional[str] = None

# -----------------------


# --- Helper Functions ---

def fetch_manga_details(title: str) -> dict:
    """
    Fetches manga details from Jikan API based on title.
    Returns a dictionary with keys: sinopsis, portada_url, autores, otras_obras
    """
    details = {
        "sinopsis": None,
        "portada_url": None,
        "autores": [],
        "otras_obras": []
    }
    
    if not title:
        return details

    jikan_url = f"https://api.jikan.moe/v4/manga"
    jikan_params = {"q": title, "limit": 1}
    
    try:
        j_resp = requests.get(jikan_url, params=jikan_params)
        if j_resp.status_code == 200:
            j_data = j_resp.json()
            if j_data.get("data"):
                manga_info = j_data["data"][0]
                details["sinopsis"] = manga_info.get("synopsis")
                
                # Prefer Jikan cover if available as it might be higher res/official
                images = manga_info.get("images", {}).get("jpg", {})
                large_image = images.get("large_image_url")
                if large_image:
                    details["portada_url"] = large_image
                elif images.get("image_url"):
                    details["portada_url"] = images.get("image_url")

                # Extract Authors
                authors = manga_info.get("authors", [])
                # Initialize authors list with basic info
                authors_data = [Author(name=a.get("name"), url=a.get("url"), mal_id=a.get("mal_id")) for a in authors]

                # Fetch Related Works (for the first author found) AND Author Image
                if authors:
                    first_author_id = authors[0].get("mal_id")
                    if first_author_id:
                        try:
                            # Fetch Author Details for Image
                            author_details_url = f"https://api.jikan.moe/v4/people/{first_author_id}"
                            ad_resp = requests.get(author_details_url)
                            if ad_resp.status_code == 200:
                                ad_data = ad_resp.json().get("data", {})
                                # Update the first author in our list with the image
                                authors_data[0].image_url = ad_data.get("images", {}).get("jpg", {}).get("image_url")

                            # Fetch Related Works
                            author_works_url = f"https://api.jikan.moe/v4/people/{first_author_id}/manga"
                            a_resp = requests.get(author_works_url, params={"limit": 5}) # Top 5 works
                            if a_resp.status_code == 200:
                                a_data = a_resp.json()
                                related_works = []
                                for work in a_data.get("data", []):
                                    # Skip the current manga if possible, but simple check is enough
                                    work_entry = work.get("manga", {})
                                    related_works.append(RelatedWork(
                                        title=work_entry.get("title"),
                                        image_url=work_entry.get("images", {}).get("jpg", {}).get("image_url"),
                                        url=work_entry.get("url")
                                    ))
                                details["otras_obras"] = related_works
                        except Exception as e:
                            print(f"Error fetching author details/works: {e}")
                
                details["autores"] = authors_data

    except Exception as e:
        print(f"Jikan API error: {e}")
        
    return details

# -----------------------

@app.post("/search", response_model=MangaSearchResult)
async def search_manga(
    file: UploadFile = File(...), 
    lang: str = Form("en"),
    include_nsfw: bool = Form(False)
):
    if not SAUCENAO_API_KEY:
        raise HTTPException(status_code=500, detail="SAUCENAO_API_KEY not configured")

    # Debug logging
    print(f"DEBUG: include_nsfw received: {include_nsfw} (Type: {type(include_nsfw)})")

    # 1. Search SauceNAO
    # hide: 0=Show All, 1=Hide Explicit, 2=Hide Suspected, 3=Hide All Explicit
    # Changing to 3 (Hide All Explicit) to ensure strict filtering
    hide_value = 0 if include_nsfw else 3
    
    print(f"DEBUG: Setting SauceNAO hide parameter to: {hide_value}")

    saucenao_url = "https://saucenao.com/search.php"
    params = {
        "db": 999,
        "output_type": 2,
        "testmode": 1,
        "numres": 12, # Increased to ensure we have enough matches after filtering
        "hide": hide_value,
        "api_key": SAUCENAO_API_KEY,
    }
    
    files = {"file": (file.filename, await file.read(), file.content_type)}
    
    try:
        response = requests.post(saucenao_url, params=params, files=files)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error contacting SauceNAO: {str(e)}")

    raw_results = data.get("results", [])
    
    # --- Manga Filter ---
    # Allowed Index IDs for Manga/Doujinshi
    # 3: DoujinshiDB
    # 18: H-Misc (nhentai etc)
    # 38: H-Misc (nhentai etc)
    # 27: H-Magazines
    # 37: MangaDex
    # 44: MangaDex
    # 51: Madokami (Manga)
    # 52: Madokami (Manga)
    MANGA_INDEX_IDS = {3, 18, 38, 27, 37, 44, 51, 52}
    
    # Filter results to only include those in the allowed indices
    results = [r for r in raw_results if r.get("header", {}).get("index_id") in MANGA_INDEX_IDS]
    
    print(f"DEBUG: Raw results: {len(raw_results)}, Filtered results: {len(results)}")

    if not results:
        # If we filtered everything out, check if we had raw results (meaning they were likely illustrations)
        if raw_results:
             return MangaSearchResult(found=False, message="No manga matches found (illustrations excluded)")
        return MangaSearchResult(found=False, message="No matches found")

    best_match = results[0]
    header = best_match.get("header", {})
    data_content = best_match.get("data", {})
    
    similarity = float(header.get("similarity", 0))
    
    # Extract title
    # Improved logic: Prioritize explicit names over source which might be a URL
    title = data_content.get("eng_name") or data_content.get("jp_name") or data_content.get("title") or data_content.get("material")
    
    # Check if title is a URL (sometimes source is put in title fields by some indexers)
    if title and (title.startswith("http") or "www." in title):
        title = None

    if not title:
        source = data_content.get("source")
        if source and not source.startswith("http") and not "www." in source:
            title = source
    
    if not title:
         # Fallback if no specific title field is found, try to use the index name or similar
         title = header.get("index_name", "").split(":")[0] # Heuristic

    # Extract Author from SauceNAO (fallback/primary for art)
    saucenao_author = data_content.get("creator") or data_content.get("member_name") or data_content.get("artist") or data_content.get("author")
    if isinstance(saucenao_author, list):
        saucenao_author = saucenao_author[0]

    # Extract chapter/page if available
    part = data_content.get("part", "")
    
    # Debug: Log the thumbnail found in header
    print(f"DEBUG: SauceNAO Header Thumbnail: {header.get('thumbnail')}")

    # Initialize result object
    result_data = MangaSearchResult(
        found=True,
        similarity_confidence=similarity,
        titulo=title,
        capitulo_estimado=part,
        pagina_estimada=None,
        sinopsis=None,
        portada_url=header.get("thumbnail"),
        match_image_url=header.get("thumbnail"), # Preserve the specific matching panel
        otras_coincidencias=[]
    )
    
    print(f"DEBUG: result_data match_image_url: {result_data.match_image_url}")

    # Process Alternative Matches
    if len(results) > 1:
        other_matches = []
        for match in results[1:]:
            m_header = match.get("header", {})
            m_data = match.get("data", {})
            m_similarity = float(m_header.get("similarity", 0))
            
            # Manual NSFW Filter: Check 'hidden' flag in header
            # SauceNAO returns 'hidden' key in header for some indexes (0=None, 1=Explicit?)
            # If we are in safe mode (include_nsfw=False) and hidden > 0, skip.
            is_hidden = m_header.get("hidden", 0)
            if not include_nsfw and is_hidden:
                continue

            if m_similarity > 40: # Filter out very low quality matches
                m_title = m_data.get("eng_name") or m_data.get("jp_name") or m_data.get("title") or m_data.get("material")
                m_source = m_data.get("source")
                if m_source and not m_source.startswith("http"):
                    m_title = m_source
                if not m_title:
                    m_title = m_header.get("index_name", "").split(":")[0]
                
                other_matches.append(OtherMatch(
                    titulo=m_title,
                    similarity=m_similarity,
                    portada_url=m_header.get("thumbnail")
                ))
        result_data.otras_coincidencias = other_matches

    if similarity < 60:
        result_data.warning = "No se encontró una coincidencia exacta"
        
    # 2. Search Jikan (only if we have a valid title)
    if title:
        details = fetch_manga_details(title)
        if details["sinopsis"]:
            result_data.sinopsis = details["sinopsis"]
        if details["portada_url"]:
            result_data.portada_url = details["portada_url"]
        if details["autores"]:
            result_data.autores = details["autores"]
        if details["otras_obras"]:
            result_data.otras_obras = details["otras_obras"]

    # Fallback: If no authors found via Jikan (or Jikan skipped), use SauceNAO author
    if not result_data.autores and saucenao_author:
        result_data.autores = [Author(
            name=saucenao_author,
            url="", 
            mal_id=None,
            image_url=None 
        )]

    # 3. Translate Synopsis
    # Always provide both English (original) and Spanish (translated) for dynamic switching
    synopsis_en = result_data.sinopsis
    synopsis_es = None

    if synopsis_en:
        result_data.sinopsis_en = synopsis_en
        try:
            translator = GoogleTranslator(source='auto', target='es')
            # Split text if too long (Google Translate limit is usually 5000 chars, but good practice)
            # For simplicity here, we'll just translate the whole block as synopsis usually fits.
            synopsis_es = translator.translate(synopsis_en)
            result_data.sinopsis_es = synopsis_es
        except Exception as e:
            print(f"Translation error (synopsis): {e}")
            result_data.sinopsis_es = synopsis_en # Fallback to English

    return result_data

@app.post("/details", response_model=MangaSearchResult)
async def get_manga_details(
    title: str = Form(...),
):
    """
    Endpoint to fetch full details for a specific manga title.
    Used when selecting an alternative match.
    """
    # Initialize basic result
    result_data = MangaSearchResult(
        found=True,
        titulo=title,
        otras_coincidencias=[] # We don't need to fetch alternatives again
    )

    # Fetch details from Jikan
    details = fetch_manga_details(title)
    
    result_data.sinopsis = details["sinopsis"]
    result_data.portada_url = details["portada_url"]
    result_data.autores = details["autores"]
    result_data.otras_obras = details["otras_obras"]

    # Translate Synopsis
    synopsis_en = result_data.sinopsis
    
    if synopsis_en:
        result_data.sinopsis_en = synopsis_en
        try:
            translator = GoogleTranslator(source='auto', target='es')
            synopsis_es = translator.translate(synopsis_en)
            result_data.sinopsis_es = synopsis_es
        except Exception as e:
            print(f"Translation error (synopsis): {e}")
            result_data.sinopsis_es = synopsis_en

    return result_data


