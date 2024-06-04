import express from "express";
import connectToDb from "./database/index.js";
import api from "./routes/api/index.js";
import path, { join } from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import cors from "cors";
import fileUpload from "express-fileupload";
// Serve static files from the frontend build directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('__dirname:', __dirname);
console.log('path.join:', path.join(__dirname, '..', 'frontend', 'build'));
const app = express();
const logfile = join(__dirname, 'bookshelf.log');
app.use(express.static("uploads"));
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/api', session({
    name: 'sessId',
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 18000000
    }
}));
app.use('/api', api);
Promise.all([connectToDb()])
    .then(() => app.listen(5000, () => console.log('BookShelf is waiting at port 5000')))
    .catch((error) => {
        console.log(`MongoDB atlas error:${error}`);
        process.exit();
    });