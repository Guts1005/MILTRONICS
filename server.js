const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing
const crypto = require('crypto'); // For generating reset tokens

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testdb'
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL (XAMPP)");
});

// ✅ Handle User Sign Up
app.post('/signup', async (req, res) => {
    const { signupUsername, signupEmail, signupPassword } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(signupPassword, 10);

    // Insert into database
    let sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [signupUsername, signupEmail, hashedPassword], (err, result) => {
        if (err) {
            res.send("Error: Email already exists or invalid data.");
        } else {
            res.send("User registered successfully!");
        }
    });
});

// ✅ Handle User Login
app.post('/login', (req, res) => {
    const { loginEmail, loginPassword } = req.body;

    let sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [loginEmail], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];

            // Compare hashed password
            const match = await bcrypt.compare(loginPassword, user.password);
            if (match) {
                res.send("Login successful!");
            } else {
                res.send("Invalid password.");
            }
        } else {
            res.send("User not found.");
        }
    });
});

// ✅ Handle Forgot Password
app.post('/forgot-password', (req, res) => {
    const { forgotEmail } = req.body;

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save the reset token in the database
    let sql = "UPDATE users SET reset_token = ? WHERE email = ?";
    db.query(sql, [resetToken, forgotEmail], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send(`Password reset link: http://localhost/reset-password?token=${resetToken}`);
        } else {
            res.send("Email not found.");
        }
    });
});

// Start the Server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
