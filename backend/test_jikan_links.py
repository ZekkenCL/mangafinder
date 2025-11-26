from app.services.jikan import fetch_manga_details
import json

def test():
    print("Fetching details for 'Naruto'...")
    details = fetch_manga_details("Naruto")
    print("External Links found:")
    print(json.dumps([l.dict() for l in details.get('external_links', [])], indent=2))

    print("\nFetching details for 'Berserk'...")
    details = fetch_manga_details("Berserk")
    print("External Links found:")
    print(json.dumps([l.dict() for l in details.get('external_links', [])], indent=2))

if __name__ == "__main__":
    test()
