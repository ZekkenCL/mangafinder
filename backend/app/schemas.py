from typing import List, Optional
from pydantic import BaseModel

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
