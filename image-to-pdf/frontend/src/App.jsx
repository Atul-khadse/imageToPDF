import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [images, setImages] = useState([]);
  const [isMultiple, setIsMultiple] = useState(true); 
  const [pdfUrl, setPdfUrl] = useState("");

  // Handle image file selection
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages([...images, ...selectedFiles]);
  };

  const handleImageReorder = (index, direction) => {
    const newImages = [...images];
    const [removed] = newImages.splice(index, 1);
    newImages.splice(index + direction, 0, removed);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post("http://localhost:5000/api/pdf/convert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", 
      });
        
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPdfUrl(url); 
    } catch (error) {
      console.error("Error uploading images", error);
      alert("Error uploading images.");
    }
  };
   
  return (
    <div className="min-h-screen bg-gray-300 flex justify-center items-center p-4">
      <div className="bg-cyan-700  p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-semibold mb-4 text-center">Image to PDF Converter</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xl font-semibold text-gray-200 mb-2">
              Select Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple={isMultiple}
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Reordering */}
          <div className="space-y-2">
            {images.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Image Order</h2>
                <ul className="space-y-2">
                  {images.map((image, index) => (
                    <li key={index} className="flex justify-between items-center">
                  
                      <span className="flex items-center my-1.5 space-x-2">
                        <span>{index + 1}.</span>
                        <span>{image.name}</span>
                      </span>

                    
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleImageReorder(index, -1)}
                          disabled={index === 0}
                          className="px-2 py-1 text-white bg-gray-500 rounded-md"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImageReorder(index, 1)}
                          disabled={index === images.length - 1}
                          className="px-2 py-1 text-white bg-gray-500 rounded-md"
                        >
                          ↓
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Convert to PDF
          </button>
        </form>

        {pdfUrl && (
          <div className="mt-6 text-center w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-950 ">
            <a
              href={pdfUrl}
              download="converted.pdf"
              className="font-light"
            >
              Download PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
