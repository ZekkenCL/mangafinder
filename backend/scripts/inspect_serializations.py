import requests
import json

def inspect_serializations():
    url = "https://api.jikan.moe/v4/manga?q=Chainsaw%20Man&limit=1"
    resp = requests.get(url)
    data = resp.json()
    
    if "data" in data and len(data["data"]) > 0:
        manga = data["data"][0]
        if "serializations" in manga:
            print("Serializations:", json.dumps(manga["serializations"], indent=2))
        else:
            print("'serializations' field NOT found.")
    else:
        print("No data found.")

if __name__ == "__main__":
    inspect_serializations()
