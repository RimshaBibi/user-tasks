namespace TaskInterface {
  export interface ITaskReq {
    user_id: string,
    title: string,
    description: string
  }
  export interface ITaskRep {
    user_id: string,
    task_id: string,
    title: string,
    description: string,
    createddate: string,
    updateddate: number
  }
  export interface ITaskByIdReq {
    task_id: string
  }
  export interface ITaskBodyReq {
    task_id: string,
    title: string,
    description: string

  }
  export interface ITaskQueryReq {
    page: number,
    size: number
  }
}

class TaskSchema {


  static postAddTaskOptions = {
    schema: {
      body: {
        type: 'object',
        required: ['title', 'description'],
        properties: {
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
            createddate: { type: 'string' }
          },
        },
      },
    },
  };

  static getAllTasksOptions = {
    schema: {
      Querystring: {
        type: 'object',
        required: ['page', 'size'],
        properties: {
          page: { type: 'integer' },
          size: { type: 'integer' }
        }
      },
      response: {
        200: {
          type: 'array',
          properties: {
            user_id: { type: 'string' },
            task_id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            createddate: { type: 'string' },
            updateddate: { type: 'string' }
          }
        }
      }
    }
  }

  static getTaskByIdOptions = {
    schema: {
      params: {
        type: 'object',
        required: ['task_id'],
        properties: {
          task_id: { type: 'string' }
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
            createddate: { type: 'string' },
            updateddate: { type: 'string' }
          },
        },
      },
    }
  }
  static getTaskByUserIdOptions = {
    schema: {
      Querystring: {
        type: 'object',
        required: ['page', 'size'],
        properties: {
          page: { type: 'integer' },
          size: { type: 'integer' }
        }
      },
      response: {
        200: {
          type: 'array',
          properties: {
            user_id: { type: 'string' },
            task_id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            createddate: { type: 'string' },
            updateddate: { type: 'string' }
          },
        },
      },
    },
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
            user_id: { type: 'string' },
            updateddate: { type: 'string' }
          },
        },
      },
    },
  };

  static deleteTaskByIdOptions = {
    schema: {
      params: {
        type: 'object',
        required: ['task_id'],
        properties: {
          task_id: { type: 'string' }
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
export { TaskInterface, TaskSchema }