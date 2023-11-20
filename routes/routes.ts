import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import UserController from '../controllers/userController';
import { UserRepository } from '../repository/userRepository';
import { Pool } from 'pg';
import { Interfaces, UserSchema } from '../models/userModel';
import { TaskInterface, TaskSchema } from '../models/taskModel';
import { TaskController } from '../controllers/taskController';
import { TaskRepository } from '../repository/taskRepository';
import authMiddleware from '../middlewares/auth_middleware';
import multer from 'fastify-multer';
import FileMiddleware from '../middlewares/file_middleware';



class Routes {

  static routes(fastify: FastifyInstance, opts: any, done: () => void) {
    // fastify.get('/', async (request, reply) => {
    //     reply.send("route is active")
    //   });
    const db = new Pool();
    const userRepository = new UserRepository(db);
    const userController = new UserController(userRepository);
    const taskRepository = new TaskRepository(db);
    const taskController = new TaskController(taskRepository);



    authMiddleware(fastify);

    fastify.register(multer.contentParser);


    fastify.post<{ Body: Interfaces.IUserSignUpReq }>('/signup', UserSchema.postUserSignUpOptions, async (request, reply) => {
      // console.log(`the request data is ${request.body}`)
      return userController.signup(request, reply);
    })

    fastify.post<{ Body: Interfaces.IUserSignInReq }>('/signin', UserSchema.postUserSignInOptions, async (request, reply) => {
      // console.log(`the request data is ${request.body}`)
      return userController.signin(request, reply);
    })

    fastify.post<{ Body: Interfaces.IRefreshReq }>('/auth/refresh-token', UserSchema.postRefreshTokenOptions, async (request, reply) => {
      // console.log(`the request data is ${request.body}`)
      return userController.refresh(request, reply);
    })

    fastify.post<{ Body: TaskInterface.ITaskReq }>('/addTask', { ...TaskSchema.postAddTaskOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.addTasks(request, reply);
    })

    fastify.post<{ Params: TaskInterface.ITaskByIdReq }>('/upload/:task_id', {...TaskSchema.postTaskFileByIdOptions ,preHandler: [FileMiddleware.uploadImage.single('file'), fastify.authenticate,] }, async (request, reply) => {
      return taskController.uploadFile(request, reply);
    })

    fastify.get<{ Params: TaskInterface.ITaskByIdReq }>('/get_file/:task_id', { ...TaskSchema.getTaskFileByIdOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.getTaskFile(request, reply);
    })

    fastify.get<{ Querystring: TaskInterface.ITaskQueryReq }>('/getAllTasks', { ...TaskSchema.getAllTasksOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.getAllTasks(request, reply);
    })

    fastify.get<{ Params: TaskInterface.ITaskByIdReq }>('/getOneTask/:task_id', { ...TaskSchema.getTaskByIdOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.getOneTask(request, reply);
    })

    fastify.get<{ Querystring: TaskInterface.ITaskQueryReq }>('/getUserTasks', { ...TaskSchema.getTaskByUserIdOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      // console.log((request as any).user.user_id)
      return taskController.getUserTask(request, reply)
    })

    fastify.put<{ Params: TaskInterface.ITaskByIdReq, Body: TaskInterface.ITaskBodyReq }>('/updateTask/:task_id', { ...TaskSchema.putUpdateTaskOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.updateTask(request, reply);
    })

    fastify.delete<{ Params: TaskInterface.ITaskByIdReq }>('/deleteTask/:task_id', { ...TaskSchema.deleteTaskByIdOptions, preHandler: fastify.authenticate }, async (request, reply) => {
      return taskController.deleteTask(request, reply)
    })

    done();
  }
}
export default Routes;
