// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/teacher_databse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the existing schema
const teacherSchema = new mongoose.Schema({
  Id: Number, // Assuming this is the field name in your collection
  Name: String,
  Password: Number, // Ensure this is defined as a Number
}, { collection: 'teacher_data' });

const Teacher = mongoose.model('Teacher', teacherSchema);

// Schedule schema
const TeacherScheduleSchema = new mongoose.Schema({
  Id: Number,
  Periods: [String],
  Timings: [String],
  Schedule: [
    {
      Day: String,
      Periods: [String],
    },
  ],
}, { collection: 'teacher_schedule' });
const TeacherSchedule = mongoose.model('TeacherSchedule', TeacherScheduleSchema);

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { teacherId, password } = req.body;
  try {
    console.log('Login Request Data:', { teacherId, password });

    // Fetch teacher data by Id and Password
    const teacher = await Teacher.findOne({ Id: teacherId, Password: password });

    if (teacher) {
      console.log('Teacher Data:', teacher);
      return res.json({ success: true, teacher });
    } else {
      console.log('Invalid login attempt for Teacher ID:', teacherId);
      return res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Schedule endpoint
app.get('/api/teacher-schedule/:id', async (req, res) => {
  console.log('=== SCHEDULE REQUEST RECEIVED ===');
  console.log('Full Request Headers:', req.headers);
  console.log('Request Parameters:', req.params);
  console.log('Request Query:', req.query);

  try {
    const teacherId = parseInt(req.params.id);
    
    console.log('Searching for schedule with EXACT ID:', teacherId, typeof teacherId);
    
    // Log all documents in the collection for debugging
    const allDocuments = await TeacherSchedule.find({});
    console.log('ALL DOCUMENTS IN COLLECTION:', allDocuments.map(doc => ({
      Id: doc.Id,
      type: typeof doc.Id
    })));

    // Find the schedule by ID with more flexible matching
    const teacherSchedule = await TeacherSchedule.findOne({ 
      Id: { $eq: teacherId } 
    });
    
    console.log('Found schedule:', teacherSchedule);
    
    if (!teacherSchedule) {
      console.log('NO SCHEDULE FOUND FOR THIS TEACHER');
      return res.status(404).json({ 
        message: 'No schedule found for this teacher',
        searchedId: teacherId,
        allIds: allDocuments.map(doc => doc.Id)
      });
    }
    
    res.json(teacherSchedule);
  } catch (error) {
    console.error('CRITICAL ERROR fetching teacher schedule:', error);
    res.status(500).json({ 
      message: 'Error fetching teacher schedule', 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// schedule.jsx
