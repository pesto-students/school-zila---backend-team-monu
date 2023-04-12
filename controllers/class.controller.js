const School = require("../models/school.model");
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const ClassModel = require("../models/class.model");
const addNewClass = async (req, res) => {
  let { school_uuid, student_email, class_name } = req?.body;
  if (!school_uuid || !student_email || !class_name) {
    return res.status(500).send({
      status: false,
      message: "Invalid Payload",
      error: true,
    });
  }
  school_uuid = School.find({ school_uuid: school_uuid });
  if (!school_uuid) {
    return res.status(500).send({
      status: false,
      message: "Invalid School uuid",
      error: true,
    });
  }
  student_email = Student.find({ student_email: student_email });
  if (!student_email) {
    return res.status(500).send({
      status: false,
      message: "Invalid student email",
      error: true,
    });
  }
  let classModel = ClassModel.create();
};
module.exports = { addNewClass };
