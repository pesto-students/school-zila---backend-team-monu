const School = require("../models/school.model");
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const ClassModel = require("../models/class.model");
const addNewClass = async (req, res) => {
  let { school_uuid, abbreviation, class_name } = req?.body;
  if (!school_uuid || !class_name) {
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
    let payload = {
      school_id : school_uuid?._id,
      abbreviation:abbreviation,
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

const getAllClassDetails = async (req,res) => {
  let {school_id} = req.body;
  try
  {
    let classModal;
    if(school_id)
    {
      classModal = await ClassModel.find({school_id:school_id});
    }
    else
    {
      classModal = await ClassModel.find();
    }
    if(!classModal || classModal?.length === 0)
    {
      return res.status(404).send({
        status: false,
        message: "No data found",
        error: true,
      });
    }
    classModal = classModal?.map(item=>({class_name:item?.class_name,abbreviation:item?.abbreviation}));
    return res.status(200).send({
      status: true,
      data: classModal,
      error: false,
    });
  }
  catch(err)
  {
    return res.status(500).send({
      status: false,
      message: e,
      error: true,
    });
  }
}
module.exports = { addNewClass, getAllClassDetails };
