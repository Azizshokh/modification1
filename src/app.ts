import cors from "cors";
import express from "express";
import path from "path";
import fs from "fs";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

import session from "express-session";
import ConnectMongo from "connect-mongodb-session";
import { T } from "./libs/types/common";

const MongoDBStore = ConnectMongo(session);
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection: "sessions",
});

const resolveAppPath = (...segments: string[]): string => {
    const projectRootPath = path.resolve(process.cwd(), "src", ...segments);
    if (fs.existsSync(projectRootPath)) {
        return projectRootPath;
    }

    return path.join(__dirname, ...segments);
};

/*** 1-Entrance ***/
const app = express();
app.use(express.static(resolveAppPath("public")));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

/*** 2-Sessions ***/
app.use(
    session({
        secret: String(process.env.SESSION_SECRET),
        cookie: {
            maxAge: 1000 * 3600 * 3, // 3 hours
        },
        store: store,
        resave: true,
        saveUninitialized: true,
    })
);

app.use(function (req, res, next) {
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
});

/*** 3-Views ***/
app.set("views", resolveAppPath("views"));
app.set("view engine", "ejs");

/*** 4-Routers ***/
app.use("/admin", routerAdmin); // EJS =>  BSSR: Backend Server Side Rendering
app.use("/", router);          // REACT => SPA: REACT Middleware Design Pattern

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: true,
        credentials: true,
    },
});

let summaryClient = 0;

io.on("connection", (socket) => {
    summaryClient++;
    console.log(`Connection & total [${summaryClient}]`);

    socket.on("disconnect", () => {
        summaryClient--;
        console.log(`Disconnect & total [${summaryClient}]`);
    });
});

export default server;