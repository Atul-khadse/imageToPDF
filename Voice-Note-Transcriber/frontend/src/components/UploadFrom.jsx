import { useState } from "react";
import axios from "axios";

const UploadFrom = () => {
    const [file, setFile] = useState(null);
    const [transcript, setTranscript] = useState("");
    const [summary, setSummary] = useState("");
    const [txtFilePath, setTxtFilePath] = useState("");
    const [docFilePath, setDocFilePath] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select an audio file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:3000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setTranscript(res.data.newTranscript.transcript);
            setSummary(res.data.newTranscript.summary);
            setTxtFilePath(res.data.txtFilePath);
            setDocFilePath(res.data.docFilePath);
            alert("File uploaded & transcribed successfully");
        } catch (error) {
            alert("Upload failed. Try again");
        }
    };

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Upload Audio</h2>
            <form onSubmit={handleUpload} className="space-y-4 w-full max-w-md">
                <input
                    type="file"
                    accept=".mp3, .wav"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                >
                    Upload
                </button>
            </form>

            {transcript && (
                <div className="mt-6 w-full max-w-md">
                    <h3 className="text-xl font-semibold">Transcription:</h3>
                    <p className="bg-gray-100 p-4 rounded">{transcript}</p>
                    <h3 className="text-xl font-semibold mt-4">Summary</h3>
                    <p className="bg-gray-100 p-4 rounded">{summary}</p>
                    <div className="mt-4">
                        <a href={txtFilePath} download className="text-blue-500 underline mr-4">Download TXT</a>
                        <a href={docFilePath} download className="text-blue-500 underline">Download DOC</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadFrom;