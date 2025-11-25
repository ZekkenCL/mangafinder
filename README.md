# MangaFinder

MangaFinder is a web application that allows users to find the source of manga images using the SauceNAO API. It features a modern, responsive frontend built with React and a robust backend powered by FastAPI.

## Tech Stack

### Backend
- **Framework:** FastAPI
- **Language:** Python
- **Dependencies:**
  - `uvicorn`: ASGI server
  - `python-multipart`: For handling file uploads
  - `requests`: For making external API calls
  - `python-dotenv`: For managing environment variables
  - `deep-translator`: For translating results

### Frontend
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Libraries:**
  - `axios`: For API requests
  - `framer-motion`: For animations
  - `react-dropzone`: For drag-and-drop file uploads

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows:**
     ```bash
     .\venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your SauceNAO API key.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend

From the `backend` directory:
```bash
uvicorn main:app --reload
```
The backend will run at `http://localhost:8000`.

### Start the Frontend

From the `frontend` directory:
```bash
npm run dev
```
The frontend will run at `http://localhost:5173`.

## Usage

1. Open the frontend URL in your browser.
2. Upload or drag and drop a manga image.
3. View the search results, including the source, artist, and similarity score.
