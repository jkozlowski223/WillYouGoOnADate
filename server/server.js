const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Path to store date submissions
const DATA_FILE = path.join(__dirname, 'dates.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper function to read dates from file
const readDates = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading dates file:', error);
    return [];
  }
};

// Helper function to write dates to file
const writeDates = (dates) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dates, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing dates file:', error);
    return false;
  }
};

// POST endpoint to save date
app.post('/api/save-date', (req, res) => {
  try {
    const { selectedDate, phoneNumber, activities, activityDescription } = req.body;

    // Validate required fields
    if (!selectedDate || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: selectedDate and phoneNumber are required'
      });
    }

    // Validate phone number format (9 digits)
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Expected 9 digits.'
      });
    }

    // Create date entry
    const dateEntry = {
      id: Date.now(), // Simple unique ID based on timestamp
      selectedDate,
      phoneNumber,
      activities: activities || [],
      activityDescription: activityDescription || '',
      createdAt: new Date().toISOString()
    };

    // Read existing dates
    const dates = readDates();

    // Add new date entry
    dates.push(dateEntry);

    // Save to file
    const saved = writeDates(dates);

    if (saved) {
      console.log('Date saved successfully:', dateEntry);
      return res.status(201).json({
        success: true,
        message: 'Date saved successfully! ❤️',
        data: dateEntry
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to save date'
      });
    }
  } catch (error) {
    console.error('Error in /api/save-date:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET endpoint to retrieve all dates
app.get('/api/dates', (req, res) => {
  try {
    const dates = readDates();
    return res.status(200).json({
      success: true,
      count: dates.length,
      data: dates
    });
  } catch (error) {
    console.error('Error in /api/dates:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET endpoint to retrieve a specific date by ID
app.get('/api/dates/:id', (req, res) => {
  try {
    const dates = readDates();
    const dateId = parseInt(req.params.id);
    const dateEntry = dates.find(d => d.id === dateId);

    if (dateEntry) {
      return res.status(200).json({
        success: true,
        data: dateEntry
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Date not found'
      });
    }
  } catch (error) {
    console.error('Error in /api/dates/:id:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running! ❤️',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Date app server is running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/save-date`);
  console.log(`   GET  http://localhost:${PORT}/api/dates`);
  console.log(`   GET  http://localhost:${PORT}/api/dates/:id`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
});
