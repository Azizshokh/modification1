console.log("Executed!!!");

import dotenv from "dotenv";
dotenv.config();

console.log("Port:", process.env.PORT);
console.log("Mongo_Url:", process.env.MONGO_URL);

import mongoose from "mongoose";
mongoose
    .connect(process.env.MONGO_URL as string, {})
    .then((data) => {
        console.log("Connected to MongoDB");
        const PORT = process.env.PORT || 3013;
    })
    .catch((err) => console.error("Error connecting to MongoDB:", err));

