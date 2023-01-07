require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Public routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, Express!" });
});

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Private Routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);


const port = process.env.PORT || 3000;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const dbURL = `mongodb+srv://${dbUser}:${dbPassword}@authnodejwtcluster.uxhng44.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connecting to MongoDb..");

    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch(console.log);
