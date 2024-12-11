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

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { teacherId, password } = req.body;
  try {
    console.log('Login Request Data:', { teacherId, password }); // Log incoming data

    // Fetch teacher data by Id and Password
    const teacher = await Teacher.findOne({ Id: teacherId, Password: password });

    if (teacher) {
      console.log('Teacher Data:', teacher); // Log the full teacher object
      return res.json({ success: true, teacher }); // Send the teacher object in the response
    } else {
      console.log('Invalid login attempt for Teacher ID:', teacherId);
      return res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
