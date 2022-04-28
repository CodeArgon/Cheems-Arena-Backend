import apiController from "./src/controllers/apiController.js";
import express from "express";
import cors from "cors";
// import connectDB from './src/config/db.js'
import users from './src/routes/users.js'
import 'dotenv/config'

const app = express();

// connectDB()

let corsOptions = {
    origin: "*",
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.post("/signup", users)
app.post("/login", apiController.getTokens);