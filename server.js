const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 2004; // Change this to the desired port

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'ssip',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files like CSS
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/otp_code.html');
});  

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});  

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});  

app.post('/register', (req, res) => {
  const { name, mobile_no, email, password, aadhar } = req.body;
  const query = 'INSERT INTO users (name, mobile_no, email, password, aadhar) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, mobile_no, email, password, aadhar], (dbErr, result) => {
    if (dbErr) {
      console.error('Error registering user: ' + dbErr);
      res.send('Registration failed.');
    } else {
      console.log('User registered successfully');
      res.sendFile(__dirname + '/home.html');
      //res.send('Registration successful.');
    }
  });
});

// Route to handle form submission (POST request) for login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (dbErr, results) => {
    if (dbErr) {
      console.error('Error querying the database: ' + dbErr);
      res.send('Login failed.');
    } else if (results.length === 0) {
      res.send('User not found or incorrect password.');
    } else {
      res.sendFile(__dirname + '/home.html');
      //res.send('Login successful.');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});