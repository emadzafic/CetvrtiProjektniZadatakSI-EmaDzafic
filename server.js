const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const KOMENTARI_FAJL = path.join(__dirname, "komentari.json");

function ucitajKomentare() {
    if (fs.existsSync(KOMENTARI_FAJL)) {
        return JSON.parse(fs.readFileSync(KOMENTARI_FAJL, "utf-8"));
    }
    return [];
}

function snimiKomentare(komentari) {
    fs.writeFileSync(KOMENTARI_FAJL, JSON.stringify(komentari, null, 2));
}

app.post("/api/komentar", (req, res) => {
    const noviKomentar = req.body;
    const komentari = ucitajKomentare();
    komentari.push(noviKomentar);
    snimiKomentare(komentari);
    res.status(200).json({ message: "Komentar spremljen!" });
});

app.get("/api/komentari", (req, res) => {
    const komentari = ucitajKomentare();
    res.json(komentari);
});

app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});
