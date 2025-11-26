import requests
import json

def inspect_jikan_full():
    # Naruto ID is likely 11
    manga_id = 11 
    
    print(f"Fetching full details for ID {manga_id}...")
    url_full = f"https://api.jikan.moe/v4/manga/{manga_id}/full"
    resp = requests.get(url_full)
    if resp.status_code == 200:
        data = resp.json().get("data", {})
        if "external" in data:
            print("Full endpoint 'external':", json.dumps(data["external"], indent=2))
        else:
            print("Full endpoint: 'external' field NOT found.")
    else:
        print(f"Full endpoint failed: {resp.status_code}")

    print(f"\nFetching external links for ID {manga_id}...")
    url_ext = f"https://api.jikan.moe/v4/manga/{manga_id}/external"
    resp = requests.get(url_ext)
    if resp.status_code == 200:
        data = resp.json().get("data", [])
        print("External endpoint data:", json.dumps(data, indent=2))
    else:
        print(f"External endpoint failed: {resp.status_code}")

if __name__ == "__main__":
    inspect_jikan_full()
