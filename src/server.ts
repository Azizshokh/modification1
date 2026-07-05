import dotenv from "dotenv";
dotenv.config({
    path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
import mongoose from "mongoose";
import server from "./app";
import path from "path/win32";

mongoose
    .connect(process.env.MONGO_URL as string, {})
    .then((data) => {
        console.info("MongoDB connected successfully");
        const PORT = process.env.PORT || 4000;
        server.listen(PORT, function () {
            console.info(`Server is running on port ${PORT}`);
            console.info(`Admin project on http://localhost:${PORT}/admin \n`);
        });
    })
    .catch((err) => console.error("Error connecting to MongoDB:", err));

