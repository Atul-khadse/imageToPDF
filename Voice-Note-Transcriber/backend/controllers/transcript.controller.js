const Transcription = require("../models/transcript.model");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

//  Ensure API Key is available
if (!process.env.OPENAI_API_KEY) {
    console.error(" OpenAI API Key is missing! Check your .env file.");
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000, 
});

//  Function to create transcription with retry logic
async function createTranscription(audioFilePath, retries = 3, delay = 1000) {
    try {
        if (!fs.existsSync(audioFilePath)) {
            throw new Error("Audio file does not exist.");
        }

        const audioData = fs.readFileSync(audioFilePath);
        const buffer = Buffer.from(audioData);

        const response = await openai.audio.transcriptions.create({
            model: "whisper-1",
            file: buffer, 
            response_format: "json",
        });

        return response;

    } catch (error) {
        if (error.code === "ECONNRESET" || error.status === 429) {
            if (retries > 0) {
                console.warn(` Retrying in ${delay}ms... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, delay)); 
                return await createTranscription(audioFilePath, retries - 1, delay * 2);
            }
        }
        console.error(" Error creating transcription:", error.message);
        throw error;
    }
}

//  Upload & Transcribe Audio
module.exports.uploadAudio = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioFilePath = req.file.path;
    console.log(" Received Audio File:", audioFilePath);

    try {
        //  Ensure File Exists
        if (!fs.existsSync(audioFilePath)) {
            return res.status(400).json({ error: "Audio file not found" });
        }

        console.log(" Transcribing audio...");
        const transcriptResponse = await createTranscription(audioFilePath);
        
        if (!transcriptResponse || !transcriptResponse.text) {
            throw new Error("Failed to generate transcript");
        }

        const transcriptText = transcriptResponse.text;
        console.log(" Transcription Done!");

        //  Generate Summary using GPT-3.5
        console.log(" Generating summary...");
        const summaryResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Summarize this in bullet points:\n${transcriptText}` }],
        });

        if (!summaryResponse.choices || summaryResponse.choices.length === 0) {
            throw new Error("Failed to generate summary");
        }

        const summaryText = summaryResponse.choices[0].message.content;
        console.log(" Summary Generated!");

        //  Save to Database
        const newTranscript = await Transcription.create({
            filename: req.file.originalname,
            transcript: transcriptText,
            summary: summaryText,
        });

        //  Export Transcription & Summary to TXT
        const exportsDir = path.join(__dirname, "../../exports");
        if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir);

        const txtFilePath = path.join(exportsDir, `${req.file.originalname}.txt`);
        fs.writeFileSync(txtFilePath, `Transcription:\n${transcriptText}\n\nSummary:\n${summaryText}`);

        //  Export to DOC (Simple Text Format)
        const docFilePath = path.join(exportsDir, `${req.file.originalname}.doc`);
        fs.writeFileSync(docFilePath, `Transcription:\n${transcriptText}\n\nSummary:\n${summaryText}`);

        //  Respond with Success
        res.json({ newTranscript, txtFilePath, docFilePath });

    } catch (error) {
        console.error(" Error:", error.message);
        res.status(500).json({ error: "Something went wrong" });

    } finally {
        //  Cleanup Temporary Files
        fs.unlink(audioFilePath, (err) => {
            if (err) console.error(" Failed to delete file:", err.message);
        });
    }
};


module.exports.getAllTranscription = async (req, res) => {
    try {
        const transcriptions = await Transcription.find();
        res.json(transcriptions);
    } catch (error) {
        console.error(" Error fetching transcriptions:", error.message);
        res.status(500).json({ error: "Failed to fetch transcriptions" });
    }
};
