const jobHistoryModel = require("../models/jobHistoryModel");
const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");

//load all users
exports.allUsers = async (req, res, next) => {
  //enable pagination
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const count = await User.find({}).estimatedDocumentCount();

  try {
    const users = await User.find({ role: 0 })
      .sort({ createdAt: -1 })
      .select("-password")
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.status(200).json({
      success: true,
      users,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
    next();
  } catch (error) {
    return next(error);
  }
};

//show single user
exports.singleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      user,
    });
    next();
  } catch (error) {
    return next(error);
  }
};

//edit user
exports.editUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      user,
    });
    next();
  } catch (error) {
    return next(error);
  }
};

//delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      message: "user deleted",
    });
    next();
  } catch (error) {
    return next(error);
  }
};

//jobs history
exports.createUserJobsHistory = async (req, res, next) => {
  const { jobId } = req.body;
  const file = req.file.path;
  try {
    const currentUser = await User.findOne({ _id: req.user._id });
    if (!currentUser) {
      return next(new ErrorResponse("You must log In", 401));
    } else {
      const jobHistory = new jobHistoryModel({
        jobId,
        user: req.user._id,
        cv: file,
      });
      await jobHistory.save();
    }

    res.status(200).json({
      success: true,
      currentUser,
    });
    next();
  } catch (error) {
    return next(error);
  }
};
exports.activeUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { active: true });
  if (user) return res.redirect("http://localhost:3000/login");
};

exports.changePassword = async (req, res) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;
  const isMatched = await user.comparePassword(oldPassword);
  if (!isMatched) return res.status(400).json({ message: "Wrong Password" });
  user.password = newPassword;
  user.save();
  return res.status(200).json({ message: "Success" });
};
