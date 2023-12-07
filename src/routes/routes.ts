import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import UserController from '../controllers/userController';
import { UserRepository } from '../repository/userRepository';
import { Pool } from 'pg';
import { UserSchema } from '../models/userModel';
import { TaskSchema } from '../models/taskModel';
import { Interfaces } from '../interfaces/userInterface.js'
import { TaskInterface } from '../interfaces/taskInterface.js'
import { TaskController } from '../controllers/taskController';
import { TaskRepository } from '../repository/taskRepository';
import authMiddleware from '../middlewares/auth_middleware';
import multer from 'fastify-multer';
import FileMiddleware from '../middlewares/file_middleware';
import { AdminController } from '../controllers/adminController';
import { AdminRepository } from '../repository/adminRepository';
import { AInterfaces } from '../interfaces/adminInterface';
import { ASchema } from '../models/adminModel';
import adminAuthMiddleware from '../middlewares/admin_auth_middleware';


class Routes {

  static routes(fastify: FastifyInstance, opts: any, done: () => void) {
    // fastify.get('/', async (request, reply) => {
    //     reply.send("route is active")
    //   });

    const userRepository = new UserRepository();
    const userController = new UserController(userRepository);
    const taskRepository = new TaskRepository();
    const taskController = new TaskController(taskRepository);
    const userSchema = new UserSchema()
    const taskSchema = new TaskSchema()
    const fileMiddleware = new FileMiddleware()

    const adminRepository = new AdminRepository()
    const adminController = new AdminController(adminRepository)
    const aSchema = new ASchema()


    authMiddleware(fastify);
    adminAuthMiddleware(fastify)


    fastify.register(multer.contentParser);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Admin Routes //////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////Admin Sign up ////////////////////
    fastify.post<{ Body: AInterfaces.IAdminSignUpReq }>('/adminSignup', aSchema.postAddAdminOptions, async (request, reply) => {
      return adminController.adminSignUp(request, reply)
    })
    /////////////////////////Admin Sign in ////////////////////
    fastify.post<{ Body: AInterfaces.IAdminSignInReq }>('/adminSignin', aSchema.postAdminSignInOptions, async (request, reply) => {
      return adminController.adminSignIn(request, reply)
    })
    /////////////////////////admin refresh token ////////////////////
    fastify.post<{ Body: AInterfaces.IRefreshReq }>('/auth/admin-refresh-token', aSchema.postARefreshTokenOptions, async (request, reply) => {
      // console.log(`the request data is ${request.body}`)
      return adminController.refresh(request, reply);
    })

    /////////////////////////Admin Update Status ////////////////////
    fastify.put<{ Params: AInterfaces.IAdminIdReq, Body: AInterfaces.IAdminBodyReq }>('/admin/:id', { ...aSchema.updateUserStatusOptions, preHandler: fastify.adminAuth }, async (request, reply) => {
      return adminController.updateUserStatus(request, reply)
    })

    /////////////////////////Admin Delete User ////////////////////
    fastify.delete<{ Params: AInterfaces.IAdminIdReq }>('/admin/:id', { ...aSchema.deleteUserOptions, preHandler: fastify.adminAuth }, async (request, reply) => {
      return adminController.deleteUser(request, reply)
    })


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Users Routes //////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////// Sign up ////////////////////
    fastify.post<{ Body: Interfaces.IUserSignUpReq }>('/signup', userSchema.postUserSignUpOptions, async (request, reply) => {
      // console.log(`the request data is ${request.body}`)
      return userController.signup(request, reply);
    })

    ///////////////////////// Sign in ////////////////////
    fastify.post<{ Body: Interfaces.IUserSignInReq }>('/signin', userSchema.postUserSignInOptions, async (request, reply) => {
      // console.log(`the request data is ${request.body}`)
      return userController.signin(request, reply);
    })

    ///////////////////////// refresh token ////////////////////
    fastify.post<{ Body: Interfaces.IRefreshReq }>('/auth/refresh-token', userSchema.postRefreshTokenOptions, async (request, reply) => {
      // console.log(`the request data is ${request.body}`)
      return userController.refresh(request, reply);
    })

    /////////////////////////add tasks////////////////////
    fastify.post<{ Body: TaskInterface.ITaskReq }>('/tasks', { ...taskSchema.postAddTaskOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.addTasks(request, reply);
    })

    /////////////////////// Upload file ////////////////////
    fastify.post<{ Params: TaskInterface.ITaskByIdReq }>('/upload/:id', { ...taskSchema.postTaskFileByIdOptions, preHandler: [fileMiddleware.uploadImage.single('file'), fastify.authenticate,] }, async (request, reply) => {
      return taskController.uploadFile(request, reply);
    })

    ///////////////////////// Get file ////////////////////
    fastify.get<{ Params: TaskInterface.ITaskByIdReq }>('/get_file/:id', { ...taskSchema.getTaskFileByIdOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.getTaskFile(request, reply);
    })

    // ///////////////////////// Delete file ////////////////////
    fastify.put<{ Params: TaskInterface.ITaskByIdReq }>('/delete_file/:id', { ...taskSchema.delTaskFileByIdOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.deleteTaskFile(request, reply);
    })

    ///////////////////////// get all tasks ////////////////////
    fastify.get<{ Querystring: TaskInterface.ITaskQueryReq }>('/tasks', { ...taskSchema.getAllTasksOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.getAllTasks(request, reply);
    })

    ///////////////////////// get one task by id ////////////////////
    fastify.get<{ Params: TaskInterface.ITaskByIdReq }>('/tasks/:id', { ...taskSchema.getTaskByIdOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.getOneTask(request, reply);
    })

    /////////////////////////get my tasks ////////////////////
    fastify.get<{ Querystring: TaskInterface.ITaskQueryReq }>('/tasks/my-tasks', { ...taskSchema.getMyTaskOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      // console.log((request as any).user.user_id)
      return taskController.getMyTasks(request, reply)
    })

    /////////////////////////get other user tasks ////////////////////
    fastify.get<{ Querystring: TaskInterface.ITaskQueryReq }>('/tasks/user', { ...taskSchema.getTaskByUserIdOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.getUserTasks(request, reply)
    })

    /////////////////////////update tasks////////////////////
    fastify.put<{ Params: TaskInterface.ITaskByIdReq, Body: TaskInterface.ITaskBodyReq }>('/tasks/:id', { ...taskSchema.putUpdateTaskOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.updateTask(request, reply);
    })

    /////////////////////////delete tasks////////////////////
    fastify.delete<{ Params: TaskInterface.ITaskByIdReq }>('/tasks/:id', { ...taskSchema.deleteTaskByIdOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.deleteTask(request, reply)
    })

    done();
  }
}
export default Routes;
