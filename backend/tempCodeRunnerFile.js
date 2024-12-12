const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/teacher_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const teacherSchema = new mongoose.Schema({
  Id: Number,
  Name: String,
  Password: String,
});

const Teacher = mongoose.model('Teacher', teacherSchema);

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { teacherId, password } = req.body;
  const teacher = await Teacher.findOne({ Id: teacherId, Password: password });
  if (teacher) {
    return res.json({ success: true });
  }
  return res.json({ success: false });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
