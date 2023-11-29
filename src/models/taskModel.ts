

export class TaskSchema {

  postAddTaskOptions = {
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
  postAddTaskFileOptions = {
    schema: {
      body: {
        type: 'object',
        required: ['title', 'description'],
        properties: {
          file: { type: 'string', format: 'binary' }
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
            file: { type: 'binary' },
            createddate: { type: 'string' },
          },
        },
      },
    },
  };
  postTaskFileByIdOptions = {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        201: {
          type: 'string',
        },
      },
    }
  }
  getTaskFileByIdOptions = {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            file: { type: 'string', format: 'binary' },
            filename: { type: 'string' },
            file_type: { type: 'string' },
          },
        },
      },
    }
  }
  delTaskFileByIdOptions = {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    }
  }

  getAllTasksOptions = {
    schema: {
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

  getTaskByIdOptions = {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
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
  getMyTaskOptions = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          size: { type: 'integer' },
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

  getTaskByUserIdOptions = {
    schema: {
      querystring: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
          page: { type: 'integer' },
          size: { type: 'integer' },
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

  putUpdateTaskOptions = {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
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

  deleteTaskByIdOptions = {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
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
