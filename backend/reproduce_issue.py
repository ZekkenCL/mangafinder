
import asyncio
import os
import sys
from fastapi import UploadFile
from dotenv import load_dotenv

load_dotenv()

# Add current directory to sys.path to allow importing app
sys.path.append(os.getcwd())

from app.services.saucenao import search_saucenao

class MockUploadFile:
    def __init__(self, filename, content):
        self.filename = filename
        self.content_type = "image/jpeg"
        self._content = content
    
    async def read(self):
        return self._content

async def main():
    if not os.path.exists("test_image.jpg"):
        print("test_image.jpg not found")
        return

    with open("test_image.jpg", "rb") as f:
        content = f.read()
    
    file = MockUploadFile("test_image.jpg", content)
    
    try:
        print("Calling search_saucenao...")
        result = await search_saucenao(file, include_nsfw=False)
        print("Success:", result)
    except Exception as e:
        print(f"Error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
