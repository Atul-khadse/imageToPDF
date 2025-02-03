const express = require("express");
const cors = require("cors");
const pdfRoutes = require("./routers/pdfRouters");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/pdf",pdfRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`server start at port ${PORT}`));