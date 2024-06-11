import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import LemburRoute from "./routes/LemburRoute.js";
import PiketRoute from "./routes/PiketRoute.js";
import PremiRoute from "./routes/PremiRoute.js";
// import upload from "./middleware/upload.js";
import { aggregateLembursByUser } from "./controllers/LemburService.js";
import { getAllLemburs } from "./controllers/LemburServiceEach.js";
import { aggregatePiketsByUser } from "./controllers/PiketService.js";
import { getAllPikets } from "./controllers/PiketServiceEach.js";
import { aggregatePremisByUser } from "./controllers/PremiService.js";
import { getAllPremis } from "./controllers/PremiServiceEach.js";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// const uploadDir = path.join(__dirname, "uploads");

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});


(async () => {
  await db.sync();
})();

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Gunakan variabel lingkungan untuk keamanan
    resave: false,
    saveUninitialized: false, // Mengubah menjadi false untuk menghindari menyimpan sesi yang belum dimodifikasi
    store: store,
    cookie: {
      secure: "auto", // Pastikan ini berfungsi seperti yang Anda inginkan
      httpOnly: true, // Mencegah akses ke cookie via JavaScript di sisi klien
      maxAge: 3600000, // Atur umur maksimal cookie, misalnya 1 jam
    },
  })
);

const corsOptions = {
  // origin: ['http://ettp.plnindonesiapower.co.id:3000'], // Tambahkan semua origin yang diizinkan
  origin: "http://localhost:3000", // Tambahkan semua origin yang diizinkan
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);
app.use(LemburRoute);
app.use(PiketRoute);
app.use(PremiRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/export/aggregated-lemburs/:bulan/:tahun", async (req, res) => {
  // Verifikasi superadmin, dll.
  const { bulan, tahun } = req.params;
  try {
    const aggregatedData = await aggregateLembursByUser(bulan, tahun); // Fungsi agregasi
    res.json(aggregatedData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Di file server Anda, misalnya index.js atau server.js
app.get("/export/rekap-lemburs/:bulan/:tahun", async (req, res) => {
  const { bulan, tahun } = req.params; // Mengambil bulan dan tahun dari query parameters
  try {
    const filteredData = await getAllLemburs(bulan, tahun);
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.get("/export/aggregated-pikets/:bulan/:tahun", async (req, res) => {
  const { bulan, tahun } = req.params;

  try {
    const aggregatedData = await aggregatePiketsByUser(bulan, tahun); // Fungsi agregasi
    res.json(aggregatedData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Di file server Anda, misalnya index.js atau server.js
app.get("/export/rekap-pikets/:bulan/:tahun", async (req, res) => {
  const { bulan, tahun } = req.params;
  try {
    const filteredData = await getAllPikets(bulan, tahun); // Fungsi ini harus memfilter data berdasarkan bulan
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.get("/export/aggregated-premis/:bulan/:tahun", async (req, res) => {
  const { bulan, tahun } = req.params;

  try {
    const aggregatedData = await aggregatePremisByUser(bulan, tahun); // Fungsi agregasi
    res.json(aggregatedData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Di file server Anda, misalnya index.js atau server.js
app.get("/export/rekap-premis/:bulan/:tahun", async (req, res) => {
  const { bulan, tahun } = req.params;
  try {
    const filteredData = await getAllPremis(bulan, tahun); // Fungsi ini harus memfilter data berdasarkan bulan
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server running...");
});
