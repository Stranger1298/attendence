const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5174'
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/teacher_databse')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define the teacher schema
const teacherSchema = new mongoose.Schema({
  Id: Number,
  Name: String,
  Password: Number,
}, { collection: 'teacher_data' });

const Teacher = mongoose.model('Teacher', teacherSchema);

// Define the schedule schema
const teacherScheduleSchema = new mongoose.Schema({
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

const TeacherSchedule = mongoose.model('TeacherSchedule', teacherScheduleSchema);

// Define the attendance schema
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
}, { collection: 'teacher_attendance' });

const Attendance = mongoose.model('Attendance', attendanceSchema);

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { teacherId, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ Id: teacherId, Password: password });
    if (teacher) {
      res.json({ success: true, teacher });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Fetch teacher schedule endpoint
app.get('/api/teacher-schedule/:id', async (req, res) => {
  const teacherId = parseInt(req.params.id);

  try {
    const teacherSchedule = await TeacherSchedule.findOne({ Id: teacherId });

    if (!teacherSchedule) {
      res.status(404).json({ message: 'No schedule found for this teacher' });
    } else {
      res.json(teacherSchedule);
    }
  } catch (error) {
    console.error('Error fetching teacher schedule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Mark attendance endpoint
app.post('/api/attendance/mark', async (req, res) => {
  const { userId, timestamp } = req.body;
  const currentDate = new Date(timestamp).toISOString().split('T')[0];

  try {
    let attendanceRecord = await Attendance.findOne({ Id: userId });
    const attendanceEntry = {
      Date: currentDate,
      Time_In: new Date(timestamp).toLocaleTimeString(),
      Present_Absent: 'Present',
      Time_Out: null,
    };

    if (!attendanceRecord) {
      attendanceRecord = new Attendance({
        Id: userId,
        Attendance: [attendanceEntry],
      });
    } else {
      const todayAttendance = attendanceRecord.Attendance.find(entry => entry.Date === currentDate);
      if (todayAttendance) {
        return res.status(400).json({ success: false, message: 'Attendance already marked for today' });
      }
      attendanceRecord.Attendance.push(attendanceEntry);
    }

    await attendanceRecord.save();
    res.status(200).json({ success: true, message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Scheduled task to mark absentees
schedule.scheduleJob('59 23 * * *', async () => {
  const currentDate = new Date().toISOString().split('T')[0];
  console.log(`Running scheduled task to mark absentees for ${currentDate}`);

  try {
    const allRecords = await Attendance.find({});
    for (const record of allRecords) {
      const todayAttendance = record.Attendance.find(entry => entry.Date === currentDate);
      if (!todayAttendance) {
        record.Attendance.push({
          Date: currentDate,
          Time_In: null,
          Present_Absent: 'Absent',
          Time_Out: null,
        });
        await record.save();
        console.log(`Marked absent for Id: ${record.Id}`);
      }
    }
  } catch (error) {
    console.error('Error marking absentees:', error);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
