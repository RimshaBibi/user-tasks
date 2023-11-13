import { FastifyRequest,FastifyReply } from 'fastify';
import { TaskRepository } from "../repository/taskRepository.js";
import crypto from "crypto"
import { v4 as uuid } from 'uuid';

export class TaskController{

    constructor(private taskRepository: TaskRepository) {}

    async addTasks(request: FastifyRequest<{ Body: {title:string; description: string; user_id: string } }>, reply: FastifyReply){
        const { title, description, user_id } = request.body;
        // console.log(request.body)
    try
     {
      const task_id=uuid();
      const user=await this.taskRepository.userExist(user_id);
      
      if(!user){
        //unauthorized user
        return reply.status(401).send("user not exist")
      }
      else{
        const data=await this.taskRepository.addTask(task_id,title,description,user_id);
        //   console.log(data)
        return reply.status(201).send(data)
      }
     }
     catch(e){
        reply.status(500).send('Internal Server Error');
     }
    }

    async getAllTasks( reply: FastifyReply){
        try{
        const data=await this.taskRepository.getAllTasks();
        
        if(!data)
        {
            return reply.status(404).send("No Data Found")
        }
       return reply.status(200).send(data);
        }
        catch(e){
         return   reply.status(500).send('Internal Server Error');
        }
    }

    async getOneTask(request: FastifyRequest<{  Params: { task_id: string } }>, reply: FastifyReply){
        const {task_id}=request.params
        try{
            const data=await this.taskRepository.getOneTask(task_id)
            if(!data){
                return reply.status(404).send("No task Found")
            }
            return reply.status(200).send(data)
        }
        catch(e){
          return  reply.status(500).send('Internal Server Error');
        }
    }

    async updateTask(request: FastifyRequest<{Params: { task_id: string }, Body: {title:string; description: string;} }>, reply: FastifyReply){
        const {task_id}=request.params
        const { title, description } = request.body;
        try{
            const data=await this.taskRepository.checkTask(task_id)
            if(!data){
                return reply.status(404).send("No task Found")
            }
            const result=await this.taskRepository.updateTask(task_id,title,description);

            return  reply.status(200).send(result);
        }
        catch(e){
            return  reply.status(500).send(e);
        }
    }

    async deleteTask(request:FastifyRequest<{Params: { task_id: string },}>,reply:FastifyReply){
        const {task_id}=request.params
        try{
            const data=await this.taskRepository.checkTask(task_id)
            if(!data){
                return reply.status(404).send("No task Found")
            }
            const result=await this.taskRepository.deleteTask(task_id);

            return  reply.status(200).send(result);
        }
        catch(e){
            return  reply.status(500).send(e);
        }

    }



}