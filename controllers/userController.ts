import { FastifyRequest,FastifyReply } from 'fastify';
import { UserRepository } from "../repository/userRepository.js";
import crypto from "crypto"
import { EmailServices } from './emailController.js';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';


class UserController{

    constructor(private userRepository: UserRepository) {}
    
    async signup(request: FastifyRequest<{ Body: {userName:string; userEmail: string; userPassword: string } }>, reply: FastifyReply){
        const { userName, userEmail, userPassword } = request.body;
        const info=await this.userRepository.userExist(userEmail);
        if(info)
        {
            return reply.status(409).send(info);
        }
        else{
            try{
            const salt = crypto.randomBytes(16).toString('hex'); 
             // Hash the salt and password with 1000 iterations, 64 length, and sha512 digest 
            const newPassword = crypto.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
            const user_id = uuid();
           await EmailServices.sendEmail(userName,userEmail)
           const user= await this.userRepository.signupUser(userName,userEmail,newPassword,salt,user_id)
           // console.log('User object:', user); 
           const accessTokenSecret:string  = process.env.ACCESS_TOKEN_SECRET!;
           const token = jwt.sign({user_id:user?.user_id}, accessTokenSecret, { expiresIn: '15m' });
           return reply.status(201).send({...user,token})
            }catch(e){
                reply.status(500).send('Internal Server Error');
            }
        }

    }

    async signin(request: FastifyRequest<{ Body: { userEmail: string; userPassword: string } }>, reply: FastifyReply) {
        const { userEmail, userPassword } = request.body;
            const user=await this.userRepository.signinUser(userEmail);
            if(!user)
            {
                //user not exist 
                return reply.status(404).send("User not exist")
            }
            try{
                const storedHashedPassword = user.user_password;
                // console.log(storedHashedPassword)
                const salt = user.salt;
                // console.log(salt)
                const hashedPassword  = crypto.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
                if(storedHashedPassword===hashedPassword){
                    // console.log(user)
                    const accessTokenSecret:string  = process.env.ACCESS_TOKEN_SECRET!;
                    const token = jwt.sign({user_id:user.user_id}, accessTokenSecret, { expiresIn: '15m' });
                    reply.status(200).send({...user,token});
                    return reply.status(200).send(user)
                }
                else{
                    return reply.status(401).send("Wrong password");
                }
            }catch(e){
            // console.error('Error during signin:', e);
            reply.status(500).send("Internal Server Error");
        }
      }


    async refresh(request: FastifyRequest<{ Body: { token: string ,user_id:string ,userEmail:string } }>, reply: FastifyReply) {
      const {token,user_id,userEmail } = request.body;
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
       if(!await this.userRepository.userExist(userEmail)){
        return reply.status(404).send( 'No user Found');
      }
      else{
        try {
            jwt.verify(token, accessTokenSecret);
          } catch (e) {
            if(e instanceof jwt.TokenExpiredError){
              const newToken = jwt.sign({user_id: user_id}, accessTokenSecret, { expiresIn: '15m' });
              return reply.status(201).send({token: newToken});
            }
            else if(e instanceof jwt.JsonWebTokenError){
              return reply.status(401).send("Invalid token")
            }
            return reply.status(500).send("Internal Server Error")
          }
      }
    }
}

export default UserController;