"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = __importDefault(require("../controllers/userController"));
const userRepository_1 = require("../repository/userRepository");
const pg_1 = require("pg");
const userModel_1 = require("../models/userModel");
const taskModel_1 = require("../models/taskModel");
const taskController_1 = require("../controllers/taskController");
const taskRepository_1 = require("../repository/taskRepository");
class Routes {
    static routes(fastify, opts, done) {
        // fastify.get('/', async (request, reply) => {
        //     reply.send("route is active")
        //   });
        const db = new pg_1.Pool();
        const userRepository = new userRepository_1.UserRepository(db);
        const userController = new userController_1.default(userRepository);
        const taskRepository = new taskRepository_1.TaskRepository(db);
        const taskController = new taskController_1.TaskController(taskRepository);
        fastify.post('/signup', userModel_1.UserSchema.postUserSignUpOptions, async (request, reply) => {
            // console.log(`the request data is ${request.body}`)
            return userController.signup(request, reply);
        });
        fastify.post('/signin', userModel_1.UserSchema.postUserSignInOptions, async (request, reply) => {
            // console.log(`the request data is ${request.body}`)
            return userController.signin(request, reply);
        });
        fastify.post('/addTask', taskModel_1.TaskSchema.postAddTaskOptions, async (request, reply) => {
            return taskController.addTasks(request, reply);
        });
        fastify.get('/getAllTasks', taskModel_1.TaskSchema.getAllTasksOptions, async (request, reply) => {
            return taskController.getAllTasks(reply);
        });
        fastify.get('/getOneTask/:task_id', taskModel_1.TaskSchema.getTaskByIdOptions, async (request, reply) => {
            return taskController.getOneTask(request, reply);
        });
        fastify.put('/updateTask/:task_id', taskModel_1.TaskSchema.putUpdateTaskOptions, async (request, reply) => {
            return taskController.updateTask(request, reply);
        });
        fastify.delete('/deleteTask/:task_id', taskModel_1.TaskSchema.deleteTaskByIdOptions, async (request, reply) => {
            return taskController.deleteTask(request, reply);
        });
        done();
    }
}
exports.default = Routes;
