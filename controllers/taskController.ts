import { FastifyRequest,FastifyReply } from 'fastify';
import { TaskRepository } from "../repository/taskRepository.js";
import { v4 as uuid } from 'uuid';

export class TaskController{

    constructor(private taskRepository: TaskRepository) {}

    async addTasks(request: FastifyRequest<{ Body: {title:string; description: string; user_id: string } }>, reply: FastifyReply){
        const { title, description } = request.body;
        const {user_id} = (request as any).user
        // console.log(request.body)
        if(!await this.taskRepository.userExist(user_id)){
            return reply.status(404).send("No user Exist")
            }
        else{
            try
            {
             const task_id=uuid();
             const user=await this.taskRepository.userExist(user_id);
             
             if(!user){
               //unauthorized user
               return reply.status(404).send("user not exist")
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
    
    }

    async getAllTasks( request:FastifyRequest,reply: FastifyReply){
        const {user_id} = (request as any).user
        if(!await this.taskRepository.userExist(user_id)){
            return reply.status(404).send("No user Exist")
            }
        else{
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
      
    }

    async getOneTask(request: FastifyRequest<{  Params: { task_id: string } }>, reply: FastifyReply){
        const {task_id}=request.params
        const {user_id}= (request as any).user;
        if(!await this.taskRepository.userExist(user_id)){
            return reply.status(404).send("No user Exist")
            }
        else{
            try{
                const data=await this.taskRepository.getOneTask(task_id)
                if(!data){
                    return reply.status(404).send("No task Found")
                }
                else{
                    if(data.user_id!==user_id)
                    {
                        return reply.status(401).send("Unauthorized user")
                    }
                    return reply.status(200).send(data)
                }
            }
            catch(e){
              return  reply.status(500).send('Internal Server Error');
            }
        }
    }

    async getUserTask(request:FastifyRequest,reply:FastifyReply){    
        const {user_id}=(request as any).user;
        if(!await this.taskRepository.userExist(user_id)){
         return reply.status(404).send("No user Exist")
         }
         else{
             try{
                 const data=await this.taskRepository.userTasks(user_id)
                 if(!data)
                 {
                     return reply.status(404).send("No task Found")
                 }
                 else
                 {
                     return  reply.status(200).send(data);
                 }
             }
             catch(e){
                 return  reply.status(500).send("Internal server error");
             }
         }
     }

    async updateTask(request: FastifyRequest<{Params: { task_id: string }, Body: {title:string; description: string;} }>, reply: FastifyReply){
        const {task_id}=request.params
        const { title, description } = request.body;
        const {user_id}= (request as any).user;
        if(!await this.taskRepository.userExist(user_id)){
        return reply.status(404).send("No user Exist")
        }
        else{
            try{
                const data=await this.taskRepository.checkTask(task_id)
                if(!data){
                    return reply.status(404).send("No task Found")
                }
                else{
                    if(data?.user_id===user_id)
                {
                    const result=await this.taskRepository.updateTask(task_id,title,description);
                    return  reply.status(200).send(result);
                }
                else{
                    return reply.status(401).send("Unauthorized user")
                }
                }
            }
            catch(e){
                return  reply.status(500).send('Internal Server Error');
            }
        }
    }

    async deleteTask(request:FastifyRequest<{Params: { task_id: string },}>,reply:FastifyReply){
        const {task_id}=request.params
        const {user_id} = (request as any).user
        if(!await this.taskRepository.userExist(user_id)){
            return reply.status(404).send("No user Exist")
            }
        else{
            try{
                const data=await this.taskRepository.checkTask(task_id)
                if(!data){
                    return reply.status(404).send("No task Found")
                }
                else{
                    if(data.user_id!==user_id)
                    {
                        return reply.status(401).send("Unauthorized user")
                    }
                    else{
                        const result=await this.taskRepository.deleteTask(task_id);
                        return  reply.status(200).send(result);
                    }
                }
               
            }
            catch(e){
                return  reply.status(500).send("Internal server error");
            }
        }
      

    }
    
}