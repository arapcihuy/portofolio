const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// API endpoint for contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, timestamp } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create data object
    const formData = {
      name,
      email,
      message,
      timestamp
    };

    // Read existing data
    let data = [];
    try {
      const fileContent = await fs.readFile('data.json', 'utf8');
      data = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist or is empty, start with empty array
      data = [];
    }

    // Add new data
    data.push(formData);

    // Write back to file
    await fs.writeFile('data.json', JSON.stringify(data, null, 2));

    res.status(200).json({ message: 'Message received successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 