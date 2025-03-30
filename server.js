import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import session from 'express-session';
import multer from 'multer'; 
import fs from 'fs';

//Name of the student and Clg id, mail ID ,password and conform password and add which stream

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Redirect root URL to register.html
app.get('/', (req, res) => {
    res.redirect('/register.html');
});

app.use(express.static(path.join(__dirname, 'Codesensi')));

// Middleware 
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login.html');
}

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://username:password.ipu44.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Updated User schema and model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    collegeId: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    stream: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '/default-profile.png' } // New field for profile picture
});
const User = mongoose.model('User', userSchema);

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'Codesensi/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Create the directory if it doesn't exist
    console.log(`Uploads directory created at ${uploadsDir}`);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure the directory exists before saving the file
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Register route
app.post('/register', async (req, res) => {
    const { name, collegeId, email, stream, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.redirect('/register.html?error=userexists'); // Redirect with error query parameter
        }
        const newUser = new User({ name, collegeId, email, stream, username, password });
        await newUser.save();
        res.redirect('/login.html'); // Redirect to login page after successful registration
    } catch (err) {
        res.status(500).send('Error registering user: ' + err.message);
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.redirect('/login.html?error=invalid'); // Redirect with error query parameter
        }
        req.session.userId = user._id;
        res.redirect('/index.html'); // Redirect to index.html after successful login
    } catch (err) {
        res.status(500).send('Error logging in: ' + err.message);
    }
});

// Profile route
app.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user); // Send user details as JSON
    } catch (err) {
        res.status(500).send('Error fetching profile: ' + err.message);
    }
});

// Route to fetch profile data
app.get('/profile-data', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile data: ' + err.message });
    }
});

// Route to update profile picture
app.post('/update-profile-picture', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const profilePicturePath = `/uploads/${req.file.filename}`;
        await User.findByIdAndUpdate(req.session.userId, { profilePicture: profilePicturePath });
        res.status(200).json({ message: 'Profile picture updated successfully.', profilePicture: profilePicturePath });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile picture: ' + err.message });
    }
});

// Route to update user profile information
app.put('/update-profile', isAuthenticated, async (req, res) => {
    const { name, collegeId, email, stream, username } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.session.userId,
            { name, collegeId, email, stream, username },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile: ' + err.message });
    }
});

// Protect access to index.html
app.get('/index.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Codesensi', 'index.html'));
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login.html'); // Redirect to login.html after logout
    });
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'Codesensi', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

