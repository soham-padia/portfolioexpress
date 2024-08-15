const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const statsFilePath = path.join(__dirname, 'stats.json');

app.use(express.json());

// Endpoint to get stats
app.get('/stats', (req, res) => {
  fs.readFile(statsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error reading stats file');
    res.json(JSON.parse(data));
  });
});

// Endpoint to update stats
app.post('/update-stats', (req, res) => {
  fs.readFile(statsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error reading stats file');

    const stats = JSON.parse(data);
    const time = new Date().toISOString();
    stats.visits.push({ time });

    fs.writeFile(statsFilePath, JSON.stringify(stats, null, 2), (err) => {
      if (err) return res.status(500).send('Error writing to stats file');
      res.json({ message: 'Stats updated successfully', stats });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
