const ClassModel = require("../models/class.model");
const School = require("../models/school.model");
const SubjectModel = require("../models/subject.model");
const addNewCourse = async(req,res) => {
    let { school_uuid, class_name,imgUrl,subject_name } = req?.body;
    if (!school_uuid || !class_name || !imgUrl || !subject_name) {
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
    let className = await ClassModel.findOne({class_name:class_name});
    if(!className)
    {
      return res.status(404).send({
        status: false,
        message: "This class doesn't exist",
        error: true,
      });
    }
    let subjectName = await SubjectModel.findOne({subject_name:subject_name});
    if(!subjectName)
    {
      let payload = {
        school_id:school_uuid?._id,
        class_id:className?._id,
        subject_name:subject_name,
        subject_docs:[{
        date:new Date(),
        imgUrl:imgUrl,
      }]
    }
    console.log("======================subjectName,payload",subjectName,payload);
    subjectName = await SubjectModel.create(payload);
  }
  else
  {
    let payload = {...subjectName} 
    payload?.subject_docs?.push({
      data:new Date(),
      imgUrl:imgUrl,
    });
    subjectName = await SubjectModel.findOneAndUpdate({subject_name:subject_name},payload);
  }
  return res.status(200).send({
      status: true,
      message: subjectName,
      error: false,
    });
}
module.exports = {addNewCourse}