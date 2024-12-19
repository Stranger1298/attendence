// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
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

// Define the Attendance schema
const attendanceSchema = new mongoose.Schema({
  Id: Number,
  Attendance: [
    {
      Date: String,
      Time_In: String,
      Present_Absent: String,
      Time_Out: String,
    },
  ],
}, { collection: 'teacher_id' });

// Create a model for Attendance
const Attendance = mongoose.model('Attendance', attendanceSchema);

// API endpoint to mark attendance
app.post('/api/attendance/mark', async (req, res) => {
  const { userId, timestamp, location } = req.body;
  const currentDate = new Date(timestamp).toISOString().split('T')[0];

  try {
    let attendanceRecord = await Attendance.findOne({ Id: userId });

    const attendanceEntry = {
      Date: currentDate,
      Time_In: new Date(timestamp).toLocaleTimeString(),
      Present_Absent: "Present",
      Time_Out: null,
    };

    if (!attendanceRecord) {
      attendanceRecord = new Attendance({
        Id: userId,
        Attendance: [attendanceEntry],
      });
    } else {
      const todayAttendance = attendanceRecord.Attendance.find(
        entry => entry.Date === currentDate
      );

      if (todayAttendance) {
        return res.status(400).json({
          success: false,
          message: "Attendance already marked for today"
        });
      }

      attendanceRecord.Attendance.push(attendanceEntry);
    }

    await attendanceRecord.save();
    res.status(200).json({
      success: true,
      message: "Attendance marked successfully"
    });

  } catch (error) {
    console.error("Error marking attendance", error);
    res.status(500).json({
      success: false,
      message: "Attendance already made"
    });
  }
});
schedule.scheduleJob('08 15 * * *', async () => {
  const currentDate = new Date().toISOString().split('T')[0];
  console.log(`Running scheduled task to mark absentees for ${currentDate}`);

  try {
    const allRecords = await Attendance.find({});
    for (const record of allRecords) {
      const todayAttendance = record.Attendance.find(
        entry => entry.Date === currentDate
      );

      if (!todayAttendance) {
        record.Attendance.push({
          Date: currentDate,
          Time_In: null,
          Present_Absent: "Absent",
          Time_Out: null,
        });
        await record.save();
        console.log(`Marked absent for Id: ${record.Id}`);
      }
    }
  } catch (error) {
    console.error("Error marking absentees", error);
  }
});

// New API endpoint to fetch attendance statistics
// New API endpoint to fetch attendance statistics
app.get('/api/attendance/:id', async (req, res) => {
  try {
    const teacherId = Number(req.params.id);

    // Validate the parsed teacher ID
    if (isNaN(teacherId)) {
      console.error('Invalid Teacher ID:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid Teacher ID. Please provide a valid numeric ID.',
      });
    }

    console.log(`Fetching attendance for Teacher ID: ${teacherId}`);

    const attendanceRecord = await Attendance.findOne({ Id: teacherId });

    if (!attendanceRecord) {
      console.log('No attendance record found for this teacher.');
      return res.status(404).json({
        success: false,
        message: 'No attendance record found for this teacher.',
      });
    }

    // Calculate statistics
    const presentDays = attendanceRecord.Attendance.filter(
      (entry) => entry.Present_Absent === 'Present'
    ).length;

    const absentDays = attendanceRecord.Attendance.filter(
      (entry) => entry.Present_Absent === 'Absent'
    ).length;

    const timeInEntries = attendanceRecord.Attendance.filter(
      (entry) => entry.Time_In !== undefined && entry.Time_In !== null
    );

    const timeOutEntries = attendanceRecord.Attendance.filter(
      (entry) => entry.Time_Out !== undefined && entry.Time_Out !== null
    );

    const dateEntries = attendanceRecord.Attendance.filter(
      (entry) => entry.Date !== undefined && entry.Date !== null
    );

    const totalLeaves = 15; // Example value, adjust as needed
    const remainingLeaves = totalLeaves - absentDays;

    // Compile fetched data
    const fetchedData = {
      attendanceDetails: attendanceRecord.Attendance,
      presentDays,
      absentDays,
      totalLeaves,
      remainingLeaves // Full attendance array
    };

    // Log the calculated data for verification
    console.log('Fetched Attendance Data:', fetchedData);

    // Respond with calculated data
    res.status(200).json(fetchedData);
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance statistics.',
      error: error.message,
    });
  }
});

  
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// schedule.jsx
