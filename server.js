const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/teacher_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use the existing teacher_schedule collection
const TeacherSchedule = mongoose.model('TeacherSchedule', new mongoose.Schema({}, { collection: 'teacher_schedule' }));

// Endpoint to get schedule by teacher ID
app.get('/api/schedule/:id', async (req, res) => {
  try {
    const schedule = await TeacherSchedule.findOne({ Id: req.params.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 