# FFCS Timetable Generator

An automated timetable generator designed to help students using the Fully Flexible Credit System (FFCS) effortlessly create clash-free academic schedules. Instead of manually verifying slots and combinations, provide this tool with course options, and it will execute a backtracking algorithm to find a valid arrangement.

## ✨ Features

- **Course Setup Interface**: Add multiple options for your courses, specifying the course name, faculty, and slot combinations (e.g., theory and lab slots like `A1+TAA1` or `L1+L2`).
- **Automated Scheduling**: A powerful backend engine checks for slot clashes and automatically orchestrates a complete, clash-free timetable.
- **Backtracking Visualizer**: Gain an interactive, real-time look into the backtracking algorithm. See exactly which slots are selected, rejected for clashes, or marked invalid as the system evaluates potential schedules.
- **Modern UI**: An intuitive, visually pleasing, responsive interface built with Tailwind CSS.

## 🛠️ Built With

### Frontend Setup
- **React 19**
- **Vite**
- **Tailwind CSS**
- **React Router DOM**
- **Lucide React** (icons)

### Backend Services
- **Python 3**
- **Flask** (REST API)
- **Flask-CORS**
- **Pytest** (Automated Testing)

## 🚀 How to Run It Locally

To run this application, you will need to start both the Python backend and the React frontend.

### 1. Start the Backend

1. Navigate to the root folder:
   ```bash
   cd /path/to/ffcs_Project
   ```
2. *(Optional but recommended)* Create and activate a Python virtual environment.
3. Install the required dependencies:
   ```bash
   pip install flask flask-cors pytest
   ```
4. Run the backend server:
   ```bash
   python app.py
   ```
   *The server will start on `http://localhost:8080`.*

### 2. Start the Frontend

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd /path/to/ffcs_Project/frontend
   ```
2. Install the necessary Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the local URL provided by Vite (usually `http://localhost:5173`) in your browser to access the FFCS Timetable Application!

## 🧪 Running Tests

To run the unified backend test suite ensuring slot-verification and backtracking reliability:
```bash
pytest tests/
```
