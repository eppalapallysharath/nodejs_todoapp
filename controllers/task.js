import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js";

export const newTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    await Task.create({ title, description, user: req.user });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ user: userId });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    //   const { id } = req.params;

    const task = await Task.findById(req.params.id);

    // without error handling
    // if (!task)
    //   return res.status(404).json({
    //     success: false,
    //     message: "Invalid Id",
    //   });

    // with error handling
    // if (!task) return next(new Error("Invalid Id"));
    if (!task) return next(new ErrorHandler("Task Not Found", 404));

    task.isCompleted = !task.isCompleted;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task Updated",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    // without error handling
    // if (!task)
    //   return res.status(404).json({
    //     success: false,
    //     message: "Invalid Id",
    //   });

    // with error handling
    if (!task) return next(new ErrorHandler("Task Not Found", 404));

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task Deleted",
    });
  } catch (error) {
    next(error);
  }
};
