require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./src/routes/workouts");
const userRoutes = require("./src/routes/user")
const loginRoutes = require("./src/routes/login");


//express app
const app = express();

//middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/users", userRoutes);
app.use("/jwt/auth/login", loginRoutes);

//connect to db
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port 4000!");
    });
  })
  .catch((error) => {
    console.log(error);
  });
