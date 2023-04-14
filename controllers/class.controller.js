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
  school_uuid = await School.findOne({ school_uuid: school_uuid });
  if (!school_uuid) {
    return res.status(500).send({
      status: false,
      message: "Invalid School uuid",
      error: true,
    });
  }
  student_email = await Student.findOne({ student_email: student_email });
  if (!student_email) {
    return res.status(500).send({
      status: false,
      message: "Invalid student email",
      error: true,
    });
  }
  let className = await ClassModel.findOne({class_name:class_name});
  if(!className)
  {
    let payload = {
      school_id : school_uuid?._id,
      student_id:[student_email?._id],
      class_name:class_name,
    }
    className = await ClassModel.create(payload);
  }
  else
  {
    let payload = {
      school_id : className?.school_id,
      student_id:className?.student_id,
    }
    payload?.student_id?.push(student_email?._id);
    className = await ClassModel.findOneAndUpdate({class_name:class_name},payload);
  } 
 
  return res.status(200).send({
    status: true,
    message: className,
    error: false,
  });
};
module.exports = { addNewClass };
