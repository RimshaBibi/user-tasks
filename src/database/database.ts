import { Pool } from 'pg';
import { dbPassword, dbPort, dbUser, host } from '../config';


type DatabaseConfig = {
  user: any;
  password: any;
  host: any;
  port: any;
  database: string;
};


const dbConfig: DatabaseConfig = {
  user: dbUser,
  password: dbPassword,
  host: host,
  port: dbPort,
  database: 'userdatabase',
};


const pool = new Pool(dbConfig);

export default pool;


