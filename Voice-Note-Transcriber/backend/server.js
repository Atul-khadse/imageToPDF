const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./databases/db");
const transcriptionRouter = require("./routers/transcript.router");


dotenv.config();
connectDB();




const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", transcriptionRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server start at port : ${PORT}`));