# Voice Note Transcriber

## Description
This project allows users to upload audio files (MP3/WAV) and convert them to text with summaries. The transcribed text and summaries can be exported to TXT and DOC files.

## Features
- Upload audio files (max 5 minutes).
- Display transcribed text.
- Generate a bullet-point summary.
- Export text to TXT/DOC.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/Voice-Note-Transcriber.git
    cd Voice-Note-Transcriber
    ```

2. Install dependencies for the backend:
    ```bash
    cd backend
    npm install
    ```

3. Install dependencies for the frontend:
    ```bash
    cd ../frontend
    npm install
    ```

4. Create a `.env` file in the `backend` directory and add your environment variables:
    ```plaintext
    PORT=3000
    DATABASE_URL="your_mongodb_connection_string"
    OPENAI_API_KEY="your_openai_api_key"
    ```

## Usage

1. Start the backend server:
    ```bash
    cd backend
    npm start
    ```

2. Start the frontend development server:
    ```bash
    cd ../frontend
    npm run dev
    ```

3. Open your browser and navigate to `http://localhost:3000` to use the application.

## API Endpoints

- `POST /api/upload`: Upload an audio file and get the transcription and summary.
- `GET /api/transcriptions`: Get all transcriptions.

## Logical Explanation

### Backend

#### `transcript.controller.js`
This file contains the logic for handling audio file uploads, transcribing the audio to text using OpenAI's Whisper model, generating summaries using GPT-3.5, and exporting the results to TXT and DOC files. It includes error handling and retry logic for network issues.

#### `transcript.router.js`
Defines the routes for the API endpoints. It uses `multer` for handling file uploads and maps the routes to the corresponding controller functions.

#### `transcript.model.js`
Defines the Mongoose schema for storing transcriptions in the MongoDB database. It includes fields for the filename, transcript, and summary.

#### `db.js`
Handles the connection to the MongoDB database using Mongoose. It reads the database URL from the `.env` file and attempts to connect, logging success or failure messages.

### Frontend

#### `UploadFrom.jsx`
This React component provides the UI for uploading audio files. It handles the file input, sends the file to the backend for transcription, and displays the resulting transcript and summary. It also provides links to download the results as TXT and DOC files.

### Environment Variables

#### `.env`
Contains sensitive information such as the database URL and OpenAI API key. This file should not be committed to version control and is excluded using `.gitignore`.



