const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const ROLES = require("../constant/roles");
const token = jwt.sign({ foo: "bar" }, "shhhhh");
const School = require("../models/school.model");
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_TOKEN);
};

const isValidRole = (roleParam) => {
  if(!roleParam || roleParam?.length === 0)
  {
    return false;
  }
  let temp = Object.entries(ROLES).filter(([role])=>role === roleParam);
  return !temp || temp?.length === 0 ? false : true;
}
const isValidUser = async(roleParam,email) => {
  let user;
  if(roleParam === ROLES.ADMIN)
  {
    // user = await Admin.findOne({ admin_email: req.body.school_email });
  }
  else if(roleParam === ROLES.SCHOOL)
  {
    user = await School.findOne({ school_email: email });
  }
  else if(roleParam === ROLES.TEACHER)
  {
    user = await Teacher.findOne({ teacher_email: email });
  }
  else if(roleParam === ROLES.STUDENT)
  {
    user = await Student.findOne({ student_email: email });
  }
  return user;
}
const login = async (req, res) => {
  let roleParam = req.body?.role;
  if(!isValidRole(req.body?.role))
  {
    return res?.status(403).send({
      status: false,
      message: "Unauthorized access",
      error: true,
    });
  }
  try {
    let user = await isValidUser(req.body?.role,req.body?.email);   
    if (!user) {
      return res.status(403).send({
        status: false,
        message: "Invalid email",
        error: true,
      });
    }
    
    try {
      const match = await user.checkPassword(req.body?.password);
      if (!match) {
        return res.status(403).send({
          status: false,
          message: "Invalid password",
          error: true,
        });
      }
      const token = generateToken(user);
      let {school_uuid} = user;
      return res.status(200).send({
        status: true,
        token: token,
        school_uuid:school_uuid,
        message: `${roleParam} login successfull`,
        error: false,
      });
    } catch (err) {
      return res.status(500).send({
        status: false,
        message: `${roleParam} could not be logged In, some error occurred`,
        error: err.message,
      });
    }
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: `${roleParam} could not be logged In, some error occurred`,
      error: e.message,
    });
  }
};
const getAllTeacher = async(req,res) => {
  try
  {
    let {_id} = req.body?.user;
    let teacher = await Teacher.find({school_id:_id});
    if(!teacher)
    {
      return res.status(404).send({
        status: false,
        message: `No data found`,
        error: true,
      });
    }
    return res.status(200).send({
      status: true,
      data: teacher,
      error: false,
    });
  }
  catch(err)
  {
    return res.status(200).send({
      status: true,
      message: err,
      error: false,
    });
  }
}

const getAllStudent = async(req,res) => {
  try
  {
    let {_id} = req.body?.user;
    let student = await Student.find({school_id:_id});
    if(!student)
    {
      return res.status(404).send({
        status: false,
        message: `No data found`,
        error: true,
      });
    }
    student = student?.map(item=>{
      delete item?.student_password;
      return {
        student_id:item?.student_uin,
        student_name: item?.student_name,
        student_email: item?.student_email,
        student_dob: item?.student_dob,
        student_mobile: item?.student_mobile,
        student_address: item?.student_address,
        parent_name: item?.parent_name,
        parent_relationship: item?.parent_relationship,
        parent_email: item?.parent_email,
        parent_mobile: item?.parent_mobile,
      };
    })
    return res.status(200).send({
      status: true,
      data: student,
      error: false,
    });
  }
  catch(err)
  {
    return res.status(200).send({
      status: true,
      message: err,
      error: false,
    });
  }
}
const editTeacher = async(req,res) => {
  try
  {
    let id = req.body?.user?._id;
    delete req.body?.user;
    let teacher = await Teacher.findByIdAndUpdate(id,req.body);
    if(!teacher)
    {
      return res.status(404).send({
        status: false,
        message: "Can't be edited",
        error: true,
      }); 
    }
    return res.status(200).send({
      status: true,
      message: teacher,
      error: false,
    });

  }
  catch(error)
  {
    return res.status(404).send({
      status: false,
      message: error,
      error: true,
    });
  }
}

const editStudent = async(req,res) => {
  try
  {
    let id = req.body?.user?._id;
    delete req.body?.user;
    let student = await Student.findByIdAndUpdate(id,req.body);
    if(!student)
    {
      return res.status(404).send({
        status: false,
        message: "Can't be edited",
        error: true,
      }); 
    }
    return res.status(200).send({
      status: true,
      message: student,
      error: false,
    });

  }
  catch(error)
  {
    return res.status(404).send({
      status: false,
      message: error,
      error: true,
    });
  }
}

const getSchoolDetails = async(req,res) => {
  let {uuid} = req.body;
  if(!uuid || uuid?.length === 0)
  {
    return res.status(404).send({
      status: false,
      message: `Invalid school id`,
      error: true,
    });
  }
  try
  {
    uuid = await School.findOne({school_uuid:uuid});
  }
  catch(e){
    return res.status(404).send({
      status: false,
      message: e,
      error: true,
    });
  }
  if(!uuid)
  {
    return res.status(404).send({
    status: false,
    message: `Invalid school id`,
    error: true,
  });
  }
  return res.status(200).send({
    status: true,
    message: uuid,
    error: false,
  });
}
const getAllSchools = async (req,res) => {
  try
  {
    let school = await School.find();
    if(!school || school?.length === 0)
    {
      return res.status(404).send({
        status: false,
        message: "No data found",
        error: true,
      });
    }
    school = school?.map(item=>({school_name:item?.school_name,school_uuid:item?.school_uuid}));
    return res.status(200).send({
      status: true,
      message: school,
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
const signup = async (req, res) => {
  let roleParam = req.body.role;
  let email;
  if(roleParam === ROLES.ADMIN)
  {
      email = req.body.admin_email;
  }
  else if(roleParam === ROLES.SCHOOL)
  {
      email = req.body.school_email;
  }
  else if(roleParam === ROLES.TEACHER)
  {
      email = req.body.teacher_email;
  }
  else if(roleParam === ROLES.STUDENT)
  {
      email = req.body.student_email;
  }
  else
  {
    return res.status(400).send({
      status: false,
      message: `Invalid Role`,
      error: true,
    });
  }
  try {
    let user = await isValidUser(roleParam,email);
    if (user) {
      return res.status(400).send({
        status: false,
        message: `${roleParam} with same email already exist`,
        error: true,
      });
    }
   
    if(roleParam === ROLES.ADMIN)
    {
      // user = await Admin.create(req.body);
    }
    else if(roleParam === ROLES.SCHOOL)
    {
      req.body['school_uuid'] = uuidv4();
      user = await School.create(req.body);
    }
    else if(roleParam === ROLES.TEACHER)
    {
      let { school_uuid } = req.body;
      let school_id = await School.findOne({school_uuid:school_uuid});
      req.body['school_id'] = school_id;
      user = await Teacher.create(req.body);
    }
    else if(roleParam === ROLES.STUDENT)
    {
      let { school_uuid } = req.body;
      let school_id = await School.findOne({school_uuid:school_uuid});
      req.body['school_id'] = school_id;
      req.body['student_uin'] = (new Date()).getTime()+Math.floor(Math.random()*10);
      user = await Student.create(req.body);
    }
    else 
    {
      return res.status(403).send({
        status: false,
        message: `Unauthorized Access`,
        error: true,
      });
    }
    const token = generateToken(user);
    return res.status(201).send({
      status: true,
      token: token,
      message: `${roleParam} signed in successfully`,
      error: false,
    });
  } catch (e) {
    return res.status(500).send({
      status: false,
      message: `${roleParam} could not be signed up, some error occurred`,
      error: e.message,
    });
  }
};

module.exports = { login, signup, getSchoolDetails, getAllSchools,getAllTeacher, editTeacher,getAllStudent, editStudent };