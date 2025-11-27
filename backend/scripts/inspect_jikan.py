import requests
import json

def inspect_jikan():
    url = "https://api.jikan.moe/v4/manga?q=Naruto&limit=1"
    resp = requests.get(url)
    data = resp.json()
    
    if "data" in data and len(data["data"]) > 0:
        manga = data["data"][0]
        print("Keys in manga object:", manga.keys())
        if "external" in manga:
            print("External field:", json.dumps(manga["external"], indent=2))
        else:
            print("'external' field NOT found.")
    else:
        print("No data found.")

if __name__ == "__main__":
    inspect_jikan()
