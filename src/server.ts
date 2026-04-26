console.log("Executed!!!");

import dotenv from "dotenv";
dotenv.config();

console.log("Port:", process.env.PORT);
console.log("Mongo_Url:", process.env.MONGO_URL);

