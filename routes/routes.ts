import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import UserController from '../controllers/userController';
import { UserRepository } from '../repository/userRepository';
import { Pool } from 'pg';
import {Interfaces,UserSchema} from '../models/userModel';
import { TaskInterface,TaskSchema } from '../models/taskModel';
import { TaskController } from '../controllers/taskController';
import { TaskRepository } from '../repository/taskRepository';
import { request } from 'http';


class Routes{
    
 static routes(fastify: FastifyInstance, opts: any, done: () => void) {
    // fastify.get('/', async (request, reply) => {
    //     reply.send("route is active")
    //   });
    const db = new Pool();
    const userRepository = new UserRepository(db);
    const userController = new UserController(userRepository);
    const taskRepository=new TaskRepository(db);
    const taskController= new TaskController(taskRepository);


    fastify.post<{Body:Interfaces.IUserSignUpReq}>('/signup',UserSchema.postUserSignUpOptions, async (request, reply) => {
      // console.log(`the request data is ${request.body}`)
      return userController.signup(request,reply);
    })

    fastify.post<{Body:Interfaces.IUserSignInReq}>('/signin',UserSchema.postUserSignInOptions, async (request, reply) => {
        // console.log(`the request data is ${request.body}`)
        return userController.signin(request,reply);
    })

    fastify.post<{Body:TaskInterface.ITaskReq}>('/addTask',TaskSchema.postAddTaskOptions,async(request,reply)=>{
     return taskController.addTasks(request,reply);

    })

    fastify.get('/getAllTasks',TaskSchema.getAllTasksOptions, async(request,reply)=>{
      return taskController.getAllTasks(reply);
    })
    fastify.get('/getOneTask/:task_id',TaskSchema.getTaskByIdOptions, async(request,reply)=>{
      return taskController.getOneTask(request as FastifyRequest<{  Params: { task_id: string } }>,reply);
    })

    fastify.put('/updateTask/:task_id',TaskSchema.putUpdateTaskOptions,async (request,reply)=>{
      return taskController.updateTask(request as FastifyRequest<{ Params: { task_id: string }, Body: { title: string, description: string } }>,reply);
    })

    fastify.delete('/deleteTask/:task_id',TaskSchema.deleteTaskByIdOptions,async(request,reply)=>{
      return taskController.deleteTask(request as FastifyRequest<{ Params: { task_id: string } }>,reply)
    })

    done(); 
}
}
export default Routes;
