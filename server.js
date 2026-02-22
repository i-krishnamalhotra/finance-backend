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

3. Create a second file named `package.json` in the same repo with this text:

```json
{
  "name": "finance-backend",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "cors": "^2.8.5"
  }
}

4. Go to **Render.com**, click **New -> Web Service**, and connect that new GitHub repository.
5. In Render's settings, make sure you add a **Disk** to the service and mount it to `/opt/render/project/src` so the `.db` file isn't wiped when Render restarts. (You can also change `const db = new sqlite3.Database('/opt/render/project/src/finance.db')` in the code).

Once Render is live, it will give you a URL (like `https://finance-backend.onrender.com`). Go to your `index.html` file (hosted on GitHub Pages), click **Setup Render DB**, and paste that URL in!
