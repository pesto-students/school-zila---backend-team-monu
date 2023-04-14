const express = require("express");
const cors = require('cors');
const multipart = require('connect-multiparty')
const app = express();
const multipartMiddleware = multipart();
const { 
    login, 
    signup,
    getSchoolDetails,
    getAllSchools,
    editTeacher,
    editStudent 
} = require("./controllers/user.controller");
const {addNewClass} = require("./controllers/class.controller");
const {addNewCourse} = require("./controllers/course.controller");
const protect = require("./middleware/protect");
const { fileUpload, fileDownload } = require("./controllers/file.controller");
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use("/get-all-schools",getAllSchools);
app.use("/get-school-details",getSchoolDetails);
app.use("/edit-teacher",protect,editTeacher);
app.use("/edit-student",protect,editStudent);
app.use("/login", login);
app.use("/signup", signup);

app.use("/class/add",addNewClass);
app.use("/course/add",addNewCourse);

// File Upload
app.use("/upload",multipartMiddleware,fileUpload);
app.use("/download",fileDownload);
module.exports = app;