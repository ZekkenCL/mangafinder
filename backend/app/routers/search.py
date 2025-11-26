from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from deep_translator import GoogleTranslator
from ..schemas import MangaSearchResult, Author
from ..services.saucenao import search_saucenao
from ..services.jikan import fetch_manga_details

router = APIRouter()

def translate_synopsis(synopsis_en: str) -> str:
    if not synopsis_en:
        return None
    try:
        translator = GoogleTranslator(source='auto', target='es')
        return translator.translate(synopsis_en)
    except Exception as e:
        print(f"Translation error (synopsis): {e}")
        return synopsis_en

@router.post("/search", response_model=MangaSearchResult)
async def search_manga(
    file: UploadFile = File(...), 
    lang: str = Form("en"),
    include_nsfw: bool = Form(False)
):
    # Validate file type
    valid_content_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if file.content_type not in valid_content_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type: {file.content_type}. Please upload a JPG, PNG, WEBP, or GIF image."
        )
    
    # Validate file size (10MB limit)
    max_size = 10 * 1024 * 1024  # 10MB
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(
            status_code=400,
            detail="File is too large. Maximum size is 10MB."
        )
    
    # Reset file pointer for later use
    await file.seek(0)
    
    try:
        # 1. Search SauceNAO
        saucenao_result = await search_saucenao(file, include_nsfw)
        
        if not saucenao_result.get("found"):
            return MangaSearchResult(**saucenao_result)

        # Construct initial result object
        result_data = MangaSearchResult(**saucenao_result)
        
        # 2. Search Jikan (only if we have a valid title)
        title = result_data.titulo
        saucenao_author = saucenao_result.get("saucenao_author")
        
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
            if details["external_links"]:
                result_data.external_links = details["external_links"]
            if details["chapters"]:
                result_data.chapters = details["chapters"]
            if details["status"]:
                result_data.status = details["status"]
            if details["published"]:
                result_data.published = details["published"]
            if details["score"]:
                result_data.score = details["score"]
            if details["related_manga"]:
                result_data.related_manga = details["related_manga"]

        # Fallback: If no authors found via Jikan (or Jikan skipped), use SauceNAO author
        if not result_data.autores and saucenao_author:
            result_data.autores = [Author(
                name=saucenao_author,
                url="", 
                mal_id=None,
                image_url=None 
            )]

        # 3. Translate Synopsis
        result_data.sinopsis_en = result_data.sinopsis
        result_data.sinopsis_es = translate_synopsis(result_data.sinopsis)

        return result_data
    
    except HTTPException:
        # Re-raise HTTP exceptions (validation errors)
        raise
    except Exception as e:
        # Log and return a user-friendly error for unexpected errors
        print(f"Error processing image search: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="Failed to process image. Please try again with a different image."
        )

@router.post("/details", response_model=MangaSearchResult)
async def get_manga_details(
    title: str = Form(...),
):
    # Initialize basic result
    result_data = MangaSearchResult(
        found=True,
        titulo=title,
        otras_coincidencias=[] 
    )

    # Fetch details from Jikan
    details = fetch_manga_details(title)
    
    result_data.sinopsis = details["sinopsis"]
    result_data.portada_url = details["portada_url"]
    result_data.autores = details["autores"]
    result_data.otras_obras = details["otras_obras"]
    result_data.external_links = details["external_links"]
    result_data.chapters = details["chapters"]
    result_data.status = details["status"]
    result_data.published = details["published"]
    result_data.score = details["score"]
    result_data.related_manga = details["related_manga"]

    # Translate Synopsis
    result_data.sinopsis_en = result_data.sinopsis
    result_data.sinopsis_es = translate_synopsis(result_data.sinopsis)

    return result_data
