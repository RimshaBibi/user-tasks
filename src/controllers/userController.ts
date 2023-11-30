import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRepository } from 'src/repository/userRepository';
import crypto from "crypto"
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../config';


class UserController {

  constructor(private userRepository: UserRepository) { }

  async signup(request: FastifyRequest<{ Body: { userName: string; userEmail: string; userPassword: string } }>, reply: FastifyReply) {
    const { userName, userEmail, userPassword } = request.body;

    if (!userName.trim()) {
      return reply.status(400).send({ "message": "User name is required" })
    }
    else if (userPassword.length < 8 || !userPassword.trim()) {
      return reply.status(400).send({ "message": "Password must contain at least 8 characters" });
    }
    else if (await this.userRepository.userExist(userEmail.toLowerCase())) {
      return reply.status(409).send({ "message": "User already exist" });
    }
    else {
      try {
        const salt = crypto.randomBytes(16).toString('hex');
        // Hash the salt and password with 1000 iterations, 64 length, and sha512 digest 
        const newPassword = crypto.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
        const user_id = uuid();
        const currentDate = new Date().toISOString().slice(0, 10);
        const user = await this.userRepository.signupUser(userName, userEmail.toLowerCase(), newPassword, salt, user_id, currentDate, currentDate)
        // console.log('User object:', user); 
        const token = jwt.sign({ user_id: user?.user_id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        return reply.status(201).send({ ...user, token })
      } catch (e) {
        reply.status(500).send({ "message": 'Internal Server Error' });
      }
    }
  }

  async signin(request: FastifyRequest<{ Body: { userEmail: string; userPassword: string } }>, reply: FastifyReply) {
    const { userEmail, userPassword } = request.body;
    const user = await this.userRepository.signinUser(userEmail.toLowerCase());

    if (!userPassword.trim()) {
      return reply.status(400).send({ "message": "User password is required" });
    }
    else if (!user) {
      //user not exist 
      return reply.status(404).send({ "message": "User not exist" })
    }
    try {
      const storedHashedPassword = user.user_password;
      // console.log(storedHashedPassword)
      const salt = user.salt;
      // console.log(salt)
      const hashedPassword = crypto.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
      if (storedHashedPassword === hashedPassword) {
        // console.log(user)
        const token = jwt.sign({ user_id: user.user_id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        return reply.status(200).send({ ...user, token });
      }
      else {
        //invalid credentials
        return reply.status(401).send({ "message": "Enter valid credentials" });
      }
    } catch (e) {
      reply.status(500).send({ "message": "Internal Server Error" });
    }
  }


  async refresh(request: FastifyRequest<{ Body: { token: string } }>, reply: FastifyReply) {
    const { token } = request.body;

    if (!token.trim()) {
      return reply.status(400).send({ "message": 'Token is required' });
    }
    else {
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded || typeof decoded !== 'object') {
        return reply.status(401).send({ "message": "Invalid token" });
      }

      (request as any).user = decoded.payload;
      const user_id = (request as any).user.user_id
      if (!await this.userRepository.userCheck(user_id)) {
        return reply.status(404).send({ "message": "No User Exist" })
      }
      try {
        jwt.verify(token, ACCESS_TOKEN_SECRET);
        return reply.status(200).send({ "message": "Token is not expired yet" })
      } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
          console.log((request as any).user)
          const newToken = jwt.sign({ user_id: user_id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
          return reply.status(201).send({ token: newToken });
        }
        else if (e instanceof jwt.JsonWebTokenError) {
          return reply.status(401).send({ "message": "Invalid token" })
        }
        return reply.status(500).send({ "message": "Internal Server Error" })
      }
    }
  }
}

export default UserController;