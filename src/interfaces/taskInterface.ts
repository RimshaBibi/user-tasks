export namespace TaskInterface {
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
    filename: string,
    file_path: string
  }
  export interface ITaskFileAddRep {
    user_id: string,
    task_id: string,
    title: string,
    description: string,
    createddate: string,
    updateddate: number
    filename: string,
    file_path: string,
    file: string
  }
  export interface ITaskByIdReq {
    id: string
  }

  export interface ITaskFileRep {
    user_id: string,
    filename: string;
    file_type: string;
    file: Buffer;
  }
  export interface ITaskBodyReq {
    task_id: string,
    title: string,
    description: string

  }
  export interface ITaskQueryReq {
    page: number,
    size: number,
    userId: string
  }
}