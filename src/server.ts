import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

mongoose
    .connect(process.env.MONGO_URL as string, {})
    .then((data) => {
        console.log("MongoDB connected successfully");
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, function () {
            console.info(`Server is running on port ${PORT}`);
            console.info(`Admin project on http://localhost:${PORT}/admin \n`);
        });
    })
    .catch((err) => console.error("Error connecting to MongoDB:", err));

