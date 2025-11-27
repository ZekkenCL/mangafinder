import os
import requests
from dotenv import load_dotenv

load_dotenv()

SAUCENAO_API_KEY = os.getenv("SAUCENAO_API_KEY")

def inspect_saucenao(image_path):
    url = "https://saucenao.com/search.php"
    params = {
        "db": 999,
        "output_type": 2,
        "testmode": 1,
        "numres": 1,
        "api_key": SAUCENAO_API_KEY,
    }
    
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, params=params, files=files)
        
    if response.status_code == 200:
        data = response.json()
        import json
        print(json.dumps(data, indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

# Use the uploaded image
image_path = "C:/Users/benit/.gemini/antigravity/brain/9e8883bc-8dfa-42f8-bfa2-a6baf54e62da/uploaded_image_1764251795985.png"
inspect_saucenao(image_path)
