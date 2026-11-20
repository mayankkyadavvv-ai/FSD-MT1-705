# Mid Term-1 | Backend | Set B - Students API

**Name:** Mayank Yadav

**Roll No:** 2500320100705 (705)

## 1. Project Overview

In-memory Students REST API built with Node.js and Express (no database).

### Student Fields

* `id` - auto-incremented number

* `name` - text

* `course` - text

* `age` - number

## 2. API Routes

| Method | Endpoint | Description | Success Status | 
| ----- | ----- | ----- | ----- | 
| `POST` | `/api/students` | Add a new student | `201 Created` | 
| `GET` | `/api/students` | Get all students (or filter by `?course=B.Tech`) | `200 OK` | 
| `GET` | `/api/students/:id` | Get a student by ID | `200 OK` | 
| `PUT` | `/api/students/:id` | Update a student by ID | `200 OK` | 
| `DELETE` | `/api/students/:id` | Delete a student by ID | `200 OK` | 

## 3. Validation & Status Code Rules

* **Missing data** (`name`, `course`, or `age`) -> `400 Bad Request`

* **Same name twice** (duplicate `name`) -> `409 Conflict`

* **Wrong ID** (student ID not found) -> `404 Not Found`

* **New student added** -> `201 Created`

* **All other successful requests** -> `200 OK`

## 4. Query Filter

* `GET /api/students?course=B.Tech`

## 5. How to Run

npm install
npm start

Server runs on `http://localhost:3000`.
