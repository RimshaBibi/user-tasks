namespace TaskInterface{
    export interface ITaskReq{
    user_id:string,
    title:string,
    description:string
    }
    export interface ITaskRep{
    user_id:string,
    task_id:string,
    title:string,
    description:string
    }


}

class TaskSchema{


    static postAddTaskOptions = {
        schema: {
          body: {
            type: 'object',
            required: ['user_id', 'title', 'description'],
            properties: {
                user_id: { type: 'string' },
                title: { type: 'string', }, 
                description: { type: 'string' }, 
            },
          },
          response: {
            201: {
              type: 'object',
              properties: {
                user_id: { type: 'string' },
                task_id: { type: 'string' },
                title: { type: 'string' }, 
                description: { type: 'string' }, 
                
               
              },
            },
          },
        },
      };

    static getAllTasksOptions = {
        schema: {
            response: {
                200: {
                    type: 'array',
                    properties: {
                        user_id: { type: 'string' },
                        task_id: { type: 'string' },
                        title: { type: 'string' }, 
                        description: { type: 'string' }, 
                    }
                }
            }
        }
    }

    static getTaskByIdOptions = {
        schema:{
             params: {
                type: 'object',
                required: ['task_id'],
                properties: {
                    task_id: {type: 'string'}
                }
             },
            response: {
                200: {
                  type: 'object',
                  properties: {
                    user_id: { type: 'string' },
                    task_id: { type: 'string' },
                    title: { type: 'string' }, 
                    description: { type: 'string' }, 
                    
                  },
                },
              },
        }
    }
    
    static putUpdateTaskOptions = {
      schema: {
        params: {
          type: 'object',
          properties: {
            task_id: { type: 'string' },
          },
          required: ['task_id'],
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['title', 'description'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              task_id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              user_id: { type: 'string'}
            },
          },
        },
      },
    };

    static deleteTaskByIdOptions = {
      schema:{
           params: {
              type: 'object',
              required: ['task_id'],
              properties: {
                  task_id: {type: 'string'}
              }
           },
          response: {
              200: {
                type: 'string',
              },
            },
      }
  }
    

}
export {TaskInterface,TaskSchema}