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
const auth_middleware_1 = __importDefault(require("../middlewares/auth_middleware"));
const fastify_multer_1 = __importDefault(require("fastify-multer"));
const file_middleware_1 = __importDefault(require("../middlewares/file_middleware"));
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
        (0, auth_middleware_1.default)(fastify);
        fastify.register(fastify_multer_1.default.contentParser);
        fastify.post('/signup', userModel_1.UserSchema.postUserSignUpOptions, async (request, reply) => {
            // console.log(`the request data is ${request.body}`)
            return userController.signup(request, reply);
        });
        fastify.post('/signin', userModel_1.UserSchema.postUserSignInOptions, async (request, reply) => {
            // console.log(`the request data is ${request.body}`)
            return userController.signin(request, reply);
        });
        fastify.post('/auth/refresh-token', userModel_1.UserSchema.postRefreshTokenOptions, async (request, reply) => {
            // console.log(`the request data is ${request.body}`)
            return userController.refresh(request, reply);
        });
        fastify.post('/addTask', Object.assign(Object.assign({}, taskModel_1.TaskSchema.postAddTaskOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.addTasks(request, reply);
        });
        fastify.post('/upload/:task_id', Object.assign(Object.assign({}, taskModel_1.TaskSchema.postTaskFileByIdOptions), { preHandler: [file_middleware_1.default.uploadImage.single('file'), fastify.authenticate,] }), async (request, reply) => {
            return taskController.uploadFile(request, reply);
        });
        fastify.get('/get_file/:task_id', Object.assign(Object.assign({}, taskModel_1.TaskSchema.getTaskFileByIdOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.getTaskFile(request, reply);
        });
        fastify.get('/getAllTasks', Object.assign(Object.assign({}, taskModel_1.TaskSchema.getAllTasksOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.getAllTasks(request, reply);
        });
        fastify.get('/getOneTask/:task_id', Object.assign(Object.assign({}, taskModel_1.TaskSchema.getTaskByIdOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.getOneTask(request, reply);
        });
        fastify.get('/getUserTasks', Object.assign(Object.assign({}, taskModel_1.TaskSchema.getTaskByUserIdOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            // console.log((request as any).user.user_id)
            return taskController.getUserTask(request, reply);
        });
        fastify.put('/updateTask/:task_id', Object.assign(Object.assign({}, taskModel_1.TaskSchema.putUpdateTaskOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.updateTask(request, reply);
        });
        fastify.delete('/deleteTask/:task_id', Object.assign(Object.assign({}, taskModel_1.TaskSchema.deleteTaskByIdOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.deleteTask(request, reply);
        });
        done();
    }
}
exports.default = Routes;
