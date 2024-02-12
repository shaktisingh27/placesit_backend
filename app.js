const fs = require("fs");
const express = require("express");
const path = require("path");
const port = process.env.PORT || 8000;
const mongoose = require("mongoose");

const app = express();
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An Unkown error occured" });
});

mongoose
  .connect(
    `mongodb+srv://gk8508111:EYCDyKW8vehqGJ6k@cluster0.hhhd2o0.mongodb.net/Mern?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("data base connected");
    app.listen(port);
  })
  .catch((err) => console.log(err));
