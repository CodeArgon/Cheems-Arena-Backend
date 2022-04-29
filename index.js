import apiController from "./src/controllers/apiController.js";
import express from "express";
import cors from "cors";
// import connectDB from './src/config/db.js'
import users from "./src/routes/users.js";
import "dotenv/config";
// import { uploadFile } from "./src/utils/fileUpload";
import multer from "multer";
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Data is here", file);
    cb(null, "src/uploads/userprofile");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
});
// connectDB()

let corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/signup", uploadFile.single("profileImg"), users);
app.post("/login", uploadFile.single("profileImg"), apiController.getTokens);
