const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let students = [];
let currentId = 1;

app.post('/api/students', (req, res) => {
  const { name, course, age } = req.body;

  if (!name || !course || age === undefined || age === null || age === '') {
    return res.status(400).json({ message: 'Missing data' });
  }

  const existing = students.find(
    (s) => s.name.toLowerCase() === String(name).trim().toLowerCase()
  );
  if (existing) {
    return res.status(409).json({ message: 'Student already exists' });
  }

  const newStudent = {
    id: currentId++,
    name: String(name).trim(),
    course: String(course).trim(),
    age: Number(age)
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

app.get('/api/students', (req, res) => {
  const { course } = req.query;

  if (course) {
    const filtered = students.filter(
      (s) => s.course.toLowerCase() === String(course).trim().toLowerCase()
    );
    return res.status(200).json(filtered);
  }

  res.status(200).json(students);
});

app.get('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.status(200).json(student);
});

app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const { name, course, age } = req.body;

  if (!name || !course || age === undefined || age === null || age === '') {
    return res.status(400).json({ message: 'Missing data' });
  }

  const duplicate = students.find(
    (s) => s.id !== id && s.name.toLowerCase() === String(name).trim().toLowerCase()
  );
  if (duplicate) {
    return res.status(409).json({ message: 'Student already exists' });
  }

  students[index] = {
    id: id,
    name: String(name).trim(),
    course: String(course).trim(),
    age: Number(age)
  };

  res.status(200).json(students[index]);
});

app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const deleted = students.splice(index, 1)[0];
  res.status(200).json(deleted);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
