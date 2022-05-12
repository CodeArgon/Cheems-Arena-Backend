import apiController from "./src/controllers/apiController.js";
import authController from "./src/controllers/authController.js";
import deckController from "./src/controllers/deckController.js";
import {authJwt} from "./src/middlewares/authJwt.js";
import express from "express";
import cors from "cors";
// import connectDB from './src/config/db.js'
import users from "./src/routes/users.js";
import deckRoutes from "./src/routes/deckRoutes.js"
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

app.post("/api/v1/signup", uploadFile.single("profileImg"), users);
app.post(
  "/api/v1/login",
  uploadFile.single("profileImg"),
  apiController.getTokens
);
app.post(
  "/api/v1/forgot-password",
  uploadFile.single("profileImg"),
  authController.forgotPassword
);
app.post(
  "/api/v1/change-password",
  authJwt,
  uploadFile.single("profileImg"),
  authController.changePassword
);


app.post(
  "/api/v1/update-profile",
  authJwt,
  uploadFile.single("profileImg"),
  authController.updateProfile
);

app.use(`${process.env.URL_PREFIX}/deck`, deckRoutes);
