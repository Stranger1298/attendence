const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://amanraj89969:demo@cluster0.5khmm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

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
