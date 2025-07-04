const asyncHandler = require("express-async-handler");
const Goal = require("../models/goalModel");

//get Goals
//@route get /api/goals
//@access private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json(goals);
});

//set Goal
//@route POST /api/goals
//@access private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  });
  res.status(200).json(goal);
});

//update Goal
//@route PUT /api/goals
//@access private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }
  //check for user
  if (!req.user) {
    res.status(201);
    throw new Error("User not found");
  }
  //make sure the logger in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedGoal);
});

//delete Goal
//@route DELETE /api/goals
//@access private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findByIdAndDelete(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }
  //check for user
  if (!req.user) {
    res.status(201);
    throw new Error("User not found");
  }
  //make sure the logger in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  await goal.remove();
  res.status(200).json({ _id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
