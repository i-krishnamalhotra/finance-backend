const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your GitHub Pages site to talk to Render safely
app.use(express.json({ limit: '50mb' })); // Allows large images

// Create your physical .db file
const db = new sqlite3.Database('./finance.db');
db.run("CREATE TABLE IF NOT EXISTS storage (id TEXT PRIMARY KEY, data TEXT)");

// Endpoint to Save Data
app.post('/api/data', (req, res) => {
    const dataString = JSON.stringify(req.body);
    db.run("INSERT OR REPLACE INTO storage (id, data) VALUES ('main', ?)", [dataString], (err) => {
        if (err) return res.status(500).send("DB Error");
        res.send("Saved");
    });
});

// Endpoint to Load Data
app.get('/api/data', (req, res) => {
    db.get("SELECT data FROM storage WHERE id = 'main'", (err, row) => {
        if (err || !row) return res.status(404).send("{}");
        res.send(row.data);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
