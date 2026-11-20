const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// 1. In-memory array (No database)
let students = [];
let nextId = 1;

// Helper function to validate student fields (name, course, age)
function isValidStudentData(name, course, age) {
  if (
    name === undefined ||
    name === null ||
    typeof name !== 'string' ||
    name.trim() === ''
  ) {
    return false;
  }
  if (
    course === undefined ||
    course === null ||
    typeof course !== 'string' ||
    course.trim() === ''
  ) {
    return false;
  }
  if (
    age === undefined ||
    age === null ||
    age === '' ||
    isNaN(Number(age))
  ) {
    return false;
  }
  return true;
}

// 1. POST /api/students - Add a new student
app.post('/api/students', (req, res) => {
  const { name, course, age } = req.body;

  // Rule: Missing data -> 400
  if (!isValidStudentData(name, course, age)) {
    return res.status(400).json({ error: 'Missing or invalid data. Fields required: name, course, age.' });
  }

  const trimmedName = name.trim();
  const trimmedCourse = course.trim();
  const numericAge = Number(age);

  // Rule: Same name twice -> 409
  const duplicate = students.find(
    (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
  );
  if (duplicate) {
    return res.status(409).json({ error: 'Student with this name already exists.' });
  }

  const newStudent = {
    id: nextId++,
    name: trimmedName,
    course: trimmedCourse,
    age: numericAge,
  };

  students.push(newStudent);

  // Rule: New added -> 201
  return res.status(201).json(newStudent);
});

// 2. GET /api/students - Get all students (with optional ?course= filter)
app.get('/api/students', (req, res) => {
  const { course } = req.query;

  // Rule 4: Filter - Only 1 (GET /api/students?course=B.Tech)
  if (course) {
    const filteredStudents = students.filter(
      (s) => s.course.toLowerCase() === course.trim().toLowerCase()
    );
    return res.status(200).json(filteredStudents);
  }

  // Rule: Others -> 200
  return res.status(200).json(students);
});

// 3. GET /api/students/:id - Get single student by ID
app.get('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  // Rule: Wrong id -> 404
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  // Rule: Others -> 200
  return res.status(200).json(student);
});

// 4. PUT /api/students/:id - Update student by ID
app.put('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const studentIndex = students.findIndex((s) => s.id === id);

  // Rule: Wrong id -> 404
  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  const { name, course, age } = req.body;

  // Rule: Missing data -> 400
  if (!isValidStudentData(name, course, age)) {
    return res.status(400).json({ error: 'Missing or invalid data. Fields required: name, course, age.' });
  }

  const trimmedName = name.trim();
  const trimmedCourse = course.trim();
  const numericAge = Number(age);

  // Rule: Same name twice -> 409 (excluding the current student being updated)
  const duplicate = students.find(
    (s) => s.id !== id && s.name.toLowerCase() === trimmedName.toLowerCase()
  );
  if (duplicate) {
    return res.status(409).json({ error: 'Student with this name already exists.' });
  }

  students[studentIndex] = {
    id,
    name: trimmedName,
    course: trimmedCourse,
    age: numericAge,
  };

  // Rule: Others -> 200
  return res.status(200).json(students[studentIndex]);
});

// 5. DELETE /api/students/:id - Delete student by ID
app.delete('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const studentIndex = students.findIndex((s) => s.id === id);

  // Rule: Wrong id -> 404
  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];

  // Rule: Others -> 200
  return res.status(200).json({
    message: 'Student deleted successfully.',
    student: deletedStudent,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
