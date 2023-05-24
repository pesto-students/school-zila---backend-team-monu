const express = require("express");
const cors = require("cors");
const multipart = require("connect-multiparty");
const app = express();
const multipartMiddleware = multipart();
const {
  login,
  signup,
  getSchoolDetails,
  getAllSchools,
  getAllTeacher,
  editTeacher,
  getAllStudent,
  editStudent,
  addStudent,
  addTeacher,
} = require("./controllers/user.controller");
const { addNewClass } = require("./controllers/class.controller");
const { addNewCourse } = require("./controllers/course.controller");
const protect = require("./middleware/protect");
const { fileUpload, fileDownload } = require("./controllers/file.controller");
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/get-all-schools", getAllSchools);
app.use("/get-school-details", getSchoolDetails);

app.use("/teacher", protect, getAllTeacher);
app.use("/edit-teacher", protect, editTeacher);
app.use("/addTeacher", protect, addTeacher);

app.use("/student", protect, getAllStudent);
app.use("/edit-student", protect, editStudent);
app.use("/addStudent", protect, addStudent);

app.use("/login", login);
app.use("/signup", signup);

app.use("/class/add", addNewClass);
app.use("/course/add", addNewCourse);

// File Upload
app.use("/upload", multipartMiddleware, fileUpload);
app.use("/download", fileDownload);
module.exports = app;
