# Image to PDF Converter

This project allows you to convert images to a PDF file using a simple web interface.

## Features

- Upload multiple images
- Reorder images before conversion
- Download the generated PDF

## Technologies Used

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, Multer, PDFKit
- **Others:** Axios, CORS




## Controller and Routers

### Controller: `convertImageToPDF.js`

This controller handles the conversion of uploaded images to a PDF file. It uses the `PDFKit` library to create the PDF and `Multer` for handling file uploads.

### Router: `pdfRouters.js`

This router defines the endpoint for converting images to PDF. It uses the `multer` middleware to handle file uploads and calls the `convertImageToPDF` controller to process the images.



## Usage

1. Open your browser and navigate to `http://localhost:5000`.
2. Upload images using the file input.
3. Reorder images if necessary.
4. Click "Convert to PDF" to generate and download the PDF.
