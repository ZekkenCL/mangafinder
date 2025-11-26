import requests
from cachetools import TTLCache, cached
from ..schemas import Author, RelatedWork, ExternalLink

# Cache for 1 hour, max 100 items
cache = TTLCache(maxsize=100, ttl=3600)

@cached(cache)
def fetch_manga_details(title: str) -> dict:
    """
    Fetches manga details from Jikan API based on title.
    Returns a dictionary with keys: sinopsis, portada_url, autores, otras_obras, external_links
    """
    details = {
        "sinopsis": None,
        "portada_url": None,
        "autores": [],
        "otras_obras": [],
        "external_links": [],
        "chapters": None,
        "status": None,
        "published": None,
        "related_manga": []
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
                # 1. Get Basic Info from Search
                search_result = j_data["data"][0]
                mal_id = search_result.get("mal_id")
                
                # 2. Fetch Full Details if ID exists
                manga_info = search_result # Default to search result
                if mal_id:
                    try:
                        full_url = f"https://api.jikan.moe/v4/manga/{mal_id}/full"
                        full_resp = requests.get(full_url)
                        if full_resp.status_code == 200:
                            full_data = full_resp.json()
                            if full_data.get("data"):
                                manga_info = full_data["data"]
                    except Exception as e:
                        print(f"Error fetching full details: {e}")

                details["sinopsis"] = manga_info.get("synopsis")
                details["chapters"] = manga_info.get("chapters")
                details["status"] = manga_info.get("status")
                details["published"] = manga_info.get("published", {}).get("string")
                details["score"] = manga_info.get("score")
                
                # Extract Relations (Prequel/Sequel/Spin-Off/etc)
                relations = manga_info.get("relations", [])
                related_manga_list = []
                allowed_relations = ["Prequel", "Sequel", "Spin-Off", "Side Story", "Parent Story", "Alternative Setting", "Alternative Version"]
                
                for rel in relations:
                    relation_type = rel.get("relation")
                    if relation_type in allowed_relations:
                        for entry in rel.get("entry", []):
                            if entry.get("type") == "manga":
                                related_manga_list.append(RelatedWork(
                                    title=entry.get("name"),
                                    url=entry.get("url"),
                                    relation_type=relation_type
                                ))
                details["related_manga"] = related_manga_list

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

                # Extract External Links
                # Search result doesn't include external links, so we need to fetch them using the ID
                mal_id = manga_info.get("mal_id")
                if mal_id:
                    try:
                        ext_url = f"https://api.jikan.moe/v4/manga/{mal_id}/external"
                        ext_resp = requests.get(ext_url)
                        if ext_resp.status_code == 200:
                            ext_data = ext_resp.json().get("data", [])
                            details["external_links"] = [ExternalLink(name=e.get("name"), url=e.get("url")) for e in ext_data]
                    except Exception as e:
                        print(f"Error fetching external links: {e}")

    except Exception as e:
        print(f"Jikan API error: {e}")
        
    return details
