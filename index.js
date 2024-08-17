const express = require('express');
const fs = require('fs/promises'); // Use promise-based fs module
const path = require('path');
const cors = require('cors');

const app = express();
const statsFilePath = path.join(__dirname, 'stats.json');

// Configure CORS to allow requests from your React app's URL and GitHub Pages
const corsOptions = {
  origin: ['http://localhost:5173', 'https://soham-padia.github.io'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Endpoint to get stats
app.get('/stats', async (req, res) => {
  try {
    const data = await fs.readFile(statsFilePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading stats file:', err);
    res.status(500).send('Error reading stats file');
  }
});

// Endpoint to update stats
app.post('/update-stats', async (req, res) => {
  try {
    const data = await fs.readFile(statsFilePath, 'utf-8');
    const stats = JSON.parse(data);
    const time = new Date().toISOString();
    stats.visits.push({ time });

    await fs.writeFile(statsFilePath, JSON.stringify(stats, null, 2));
    res.json({ message: 'Stats updated successfully', stats });
  } catch (err) {
    console.error('Error updating stats:', err);
    res.status(500).send('Error writing to stats file');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
