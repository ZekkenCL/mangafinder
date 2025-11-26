import os
import requests
from fastapi import HTTPException, UploadFile
from typing import List, Optional
from ..schemas import MangaSearchResult, OtherMatch, Author

SAUCENAO_API_KEY = os.getenv("SAUCENAO_API_KEY")

async def search_saucenao(file: UploadFile, include_nsfw: bool) -> dict:
    if not SAUCENAO_API_KEY:
        raise HTTPException(status_code=500, detail="SAUCENAO_API_KEY not configured")

    # hide: 0=Show All, 1=Hide Explicit, 2=Hide Suspected, 3=Hide All Explicit
    hide_value = 0 if include_nsfw else 3
    
    saucenao_url = "https://saucenao.com/search.php"
    params = {
        "db": 999,
        "output_type": 2,
        "testmode": 1,
        "numres": 12,
        "hide": hide_value,
        "api_key": SAUCENAO_API_KEY,
    }
    
    # Read file content
    content = await file.read()
    files = {"file": (file.filename, content, file.content_type)}
    
    try:
        response = requests.post(saucenao_url, params=params, files=files)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error contacting SauceNAO: {str(e)}")

    raw_results = data.get("results", [])
    
    # --- Manga Filter ---
    MANGA_INDEX_IDS = {3, 18, 38, 27, 37, 44, 51, 52}
    
    results = [r for r in raw_results if r.get("header", {}).get("index_id") in MANGA_INDEX_IDS]
    
    if not results:
        if raw_results:
             return {"found": False, "message": "No manga matches found (illustrations excluded)"}
        return {"found": False, "message": "No matches found"}

    best_match = results[0]
    header = best_match.get("header", {})
    data_content = best_match.get("data", {})
    
    similarity = float(header.get("similarity", 0))
    
    # Extract title
    title = data_content.get("eng_name") or data_content.get("jp_name") or data_content.get("title") or data_content.get("material")
    
    if title and (title.startswith("http") or "www." in title):
        title = None

    if not title:
        source = data_content.get("source")
        if source and not source.startswith("http") and not "www." in source:
            title = source
    
    if not title:
         title = header.get("index_name", "").split(":")[0]

    # Extract Author
    saucenao_author = data_content.get("creator") or data_content.get("member_name") or data_content.get("artist") or data_content.get("author")
    if isinstance(saucenao_author, list):
        saucenao_author = saucenao_author[0]

    part = data_content.get("part", "")
    
    result_data = {
        "found": True,
        "similarity_confidence": similarity,
        "titulo": title,
        "capitulo_estimado": part,
        "pagina_estimada": None,
        "sinopsis": None,
        "portada_url": header.get("thumbnail"),
        "match_image_url": header.get("thumbnail"),
        "otras_coincidencias": [],
        "saucenao_author": saucenao_author # Pass this to be used if Jikan fails
    }
    
    # Process Alternative Matches
    if len(results) > 1:
        other_matches = []
        for match in results[1:]:
            m_header = match.get("header", {})
            m_data = match.get("data", {})
            m_similarity = float(m_header.get("similarity", 0))
            
            is_hidden = m_header.get("hidden", 0)
            if not include_nsfw and is_hidden:
                continue

            if m_similarity > 40:
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
        result_data["otras_coincidencias"] = other_matches

    if similarity < 60:
        result_data["warning"] = "No se encontró una coincidencia exacta"
        
    return result_data
