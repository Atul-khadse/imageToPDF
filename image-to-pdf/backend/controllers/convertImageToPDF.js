const fs = require("fs");
const PDFDocument = require("pdfkit");

const convertImageToPDF = (req, res) => {
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
        return res.status(400).json({ error: "No images uploaded" });
    }

    console.log(files)
    const pdfDoc = new PDFDocument();
    const pdfPath = "uploads/converted.pdf";
    const writeStream = fs.createWriteStream(pdfPath);
    pdfDoc.pipe(writeStream);

    req.files.forEach((file, index) => {
        if (index !== 0) pdfDoc.addPage();
        pdfDoc.image(file.path, 50, 50, { fit: [500, 700] });
        fs.unlinkSync(file.path);
    });

    pdfDoc.end();

    writeStream.on("finish", () => {
        res.download(pdfPath, "converted.pdf", () => {
            fs.unlinkSync(pdfPath);
        });
    });

    writeStream.on("error", (err) => {
        console.log("Error while writing PDF:", err);
        res.status(500).send("Error generating PDF");
    });
};

module.exports = { convertImageToPDF };