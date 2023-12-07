"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = __importDefault(require("../controllers/userController"));
const userRepository_1 = require("../repository/userRepository");
const userModel_1 = require("../models/userModel");
const taskModel_1 = require("../models/taskModel");
const taskController_1 = require("../controllers/taskController");
const taskRepository_1 = require("../repository/taskRepository");
const auth_middleware_1 = __importDefault(require("../middlewares/auth_middleware"));
const fastify_multer_1 = __importDefault(require("fastify-multer"));
const file_middleware_1 = __importDefault(require("../middlewares/file_middleware"));
const adminController_1 = require("../controllers/adminController");
const adminRepository_1 = require("../repository/adminRepository");
const adminModel_1 = require("../models/adminModel");
const admin_auth_middleware_1 = __importDefault(require("../middlewares/admin_auth_middleware"));
class Routes {
    static routes(fastify, opts, done) {
        // fastify.get('/', async (request, reply) => {
        //     reply.send("route is active")
        //   });
        const userRepository = new userRepository_1.UserRepository();
        const userController = new userController_1.default(userRepository);
        const taskRepository = new taskRepository_1.TaskRepository();
        const taskController = new taskController_1.TaskController(taskRepository);
        const userSchema = new userModel_1.UserSchema();
        const taskSchema = new taskModel_1.TaskSchema();
        const fileMiddleware = new file_middleware_1.default();
        const adminRepository = new adminRepository_1.AdminRepository();
        const adminController = new adminController_1.AdminController(adminRepository);
        const aSchema = new adminModel_1.ASchema();
        (0, auth_middleware_1.default)(fastify);
        (0, admin_auth_middleware_1.default)(fastify);
        fastify.register(fastify_multer_1.default.contentParser);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////// Admin Routes //////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////Admin Sign up ////////////////////
        fastify.post('/adminSignup', aSchema.postAddAdminOptions, async (request, reply) => {
            return adminController.adminSignUp(request, reply);
        });
        /////////////////////////Admin Sign in ////////////////////
        fastify.post('/adminSignin', aSchema.postAdminSignInOptions, async (request, reply) => {
            return adminController.adminSignIn(request, reply);
        });
        /////////////////////////admin refresh token ////////////////////
        fastify.post('/auth/admin-refresh-token', aSchema.postARefreshTokenOptions, async (request, reply) => {
            // console.log(`the request data is ${request.body}`)
            return adminController.refresh(request, reply);
        });
        /////////////////////////Admin Update Status ////////////////////
        fastify.put('/admin/:id', Object.assign(Object.assign({}, aSchema.updateUserStatusOptions), { preHandler: fastify.adminAuth }), async (request, reply) => {
            return adminController.updateUserStatus(request, reply);
        });
        /////////////////////////Admin Delete User ////////////////////
        fastify.delete('/admin/:id', Object.assign(Object.assign({}, aSchema.deleteUserOptions), { preHandler: fastify.adminAuth }), async (request, reply) => {
            return adminController.deleteUser(request, reply);
        });
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////// Users Routes //////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////// Sign up ////////////////////
        fastify.post('/signup', userSchema.postUserSignUpOptions, async (request, reply) => {
            // console.log(`the request data is ${request.body}`)
            return userController.signup(request, reply);
        });
        ///////////////////////// Sign in ////////////////////
        fastify.post('/signin', userSchema.postUserSignInOptions, async (request, reply) => {
            // console.log(`the request data is ${request.body}`)
            return userController.signin(request, reply);
        });
        ///////////////////////// refresh token ////////////////////
        fastify.post('/auth/refresh-token', userSchema.postRefreshTokenOptions, async (request, reply) => {
            // console.log(`the request data is ${request.body}`)
            return userController.refresh(request, reply);
        });
        /////////////////////////add tasks////////////////////
        fastify.post('/tasks', Object.assign(Object.assign({}, taskSchema.postAddTaskOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.addTasks(request, reply);
        });
        /////////////////////// Upload file ////////////////////
        fastify.post('/upload/:id', Object.assign(Object.assign({}, taskSchema.postTaskFileByIdOptions), { preHandler: [fileMiddleware.uploadImage.single('file'), fastify.authenticate,] }), async (request, reply) => {
            return taskController.uploadFile(request, reply);
        });
        ///////////////////////// Get file ////////////////////
        fastify.get('/get_file/:id', Object.assign(Object.assign({}, taskSchema.getTaskFileByIdOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.getTaskFile(request, reply);
        });
        // ///////////////////////// Delete file ////////////////////
        fastify.put('/delete_file/:id', Object.assign(Object.assign({}, taskSchema.delTaskFileByIdOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.deleteTaskFile(request, reply);
        });
        ///////////////////////// get all tasks ////////////////////
        fastify.get('/tasks', Object.assign(Object.assign({}, taskSchema.getAllTasksOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.getAllTasks(request, reply);
        });
        ///////////////////////// get one task by id ////////////////////
        fastify.get('/tasks/:id', Object.assign(Object.assign({}, taskSchema.getTaskByIdOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.getOneTask(request, reply);
        });
        /////////////////////////get my tasks ////////////////////
        fastify.get('/tasks/my-tasks', Object.assign(Object.assign({}, taskSchema.getMyTaskOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            // console.log((request as any).user.user_id)
            return taskController.getMyTasks(request, reply);
        });
        /////////////////////////get other user tasks ////////////////////
        fastify.get('/tasks/user', Object.assign(Object.assign({}, taskSchema.getTaskByUserIdOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.getUserTasks(request, reply);
        });
        /////////////////////////update tasks////////////////////
        fastify.put('/tasks/:id', Object.assign(Object.assign({}, taskSchema.putUpdateTaskOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.updateTask(request, reply);
        });
        /////////////////////////delete tasks////////////////////
        fastify.delete('/tasks/:id', Object.assign(Object.assign({}, taskSchema.deleteTaskByIdOptions), { preHandler: fastify.authenticate }), async (request, reply) => {
            return taskController.deleteTask(request, reply);
        });
        done();
    }
}
exports.default = Routes;
//# sourceMappingURL=routes.js.map