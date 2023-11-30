import { FastifyRequest, FastifyReply } from 'fastify';
import crypto from "crypto"
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import { AdminRepository } from 'src/repository/adminRepository';
import { ADMIN_ACCESS_TOKEN_SECRET } from '../config';


export class AdminController {
  constructor(private adminRepository: AdminRepository) { }

  async noUserFound(user_id: string) {
    if (!await this.adminRepository.checkUser(user_id)) {
      return { message: "No User Exist" };
    }
    else {
      return null
    }
  }

  async adminSignUp(request: FastifyRequest<{ Body: { userName: string; userEmail: string; userPassword: string } }>, reply: FastifyReply) {
    const { userName, userEmail, userPassword } = request.body;

    if (!userName.trim()) {
      return reply.status(400).send({ "message": "User name is required" })
    }
    else if (userPassword.length < 8 || !userPassword.trim()) {
      return reply.status(400).send({ "message": "Password must contain at least 8 characters" });
    }
    else {
      try {
        const salt = crypto.randomBytes(16).toString('hex');
        // Hash the salt and password with 1000 iterations, 64 length, and sha512 digest 
        const newPassword = crypto.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
        const user_id = uuid();
        const currentDate = new Date().toISOString().slice(0, 10);
        const user = await this.adminRepository.adminSignUp(userName, userEmail.toLowerCase(), newPassword, salt, user_id, currentDate, currentDate)
        const token = jwt.sign({ admin_id: user?.user_id }, ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        return reply.status(201).send({ ...user, token })
      } catch (e) {
        return reply.status(500).send({ "message": e });
      }
    }
  }

  async adminSignIn(request: FastifyRequest<{ Body: { userEmail: string; userPassword: string } }>, reply: FastifyReply) {
    const { userEmail, userPassword } = request.body;
    const user = await this.adminRepository.adminSignIn(userEmail.toLowerCase());

    if (!userPassword.trim()) {
      return reply.status(400).send({ "message": "User password is required" });
    }
    else if (!user) {
      //user not exist 
      return reply.status(404).send({ "message": "User not exist" })
    }
    else {
      try {
        const storedHashedPassword = user.user_password;
        const salt = user.salt;
        const hashedPassword = crypto.pbkdf2Sync(userPassword, salt, 1000, 64, 'sha512').toString('hex');
        if (storedHashedPassword === hashedPassword) {
          const token = jwt.sign({ admin_id: user.user_id }, ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
          return reply.status(200).send({ ...user, token });
        }
        else {
          //invalid credentials
          return reply.status(401).send({ "message": "Enter valid credentials" });
        }
      } catch (e) {
        return reply.status(500).send({ "message": "Internal Server Error" });
      }
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
      (request as any).admin = decoded.payload;
      const admin_id = (request as any).admin.admin_id
      const result = await this.noUserFound(admin_id)
      if (result !== null) {
        return reply.status(404).send({ message: "No Admin Exist" })
      }
      try {
        jwt.verify(token, ADMIN_ACCESS_TOKEN_SECRET);
        return reply.status(200).send({ "message": "Token is not expired yet" })
      } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
          console.log((request as any).user)
          const newToken = jwt.sign({ user_id: admin_id }, ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
          return reply.status(201).send({ token: newToken });
        }
        else if (e instanceof jwt.JsonWebTokenError) {
          return reply.status(401).send({ "message": "Invalid token" })
        }
        return reply.status(500).send({ "message": "Internal Server Error" })
      }
    }
  }

  async updateUserStatus(request: FastifyRequest<{ Params: { id: string }, Body: { status: string } }>, reply: FastifyReply) {
    const { id } = request.params
    const { status } = request.body
    const { admin_id } = (request as any).admin
    if (!request.params.id || request.params.id === ':id') {
      return reply.status(400).send({ "message": "User id is required in params" })
    }
    else {
      const result = await this.noUserFound(admin_id)
      if (result !== null) {
        return reply.status(404).send({ "message": "No Admin Exist" })
      }
      const userInfo = await this.noUserFound(id)
      if (userInfo !== null) {
        return reply.status(404).send(userInfo)
      }
      try {
        const data = await this.adminRepository.updateUserStatus(status, id)
        return reply.status(200).send({ "message": data })
      }
      catch (e) {
        return reply.status(500).send({ "message": "Internal Server Error" });
      }
    }
  }

  async deleteUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params
    const { admin_id } = (request as any).admin
    if (!request.params.id || request.params.id === ':id') {
      return reply.status(400).send({ "message": "User id is required in params" })
    }
    else {
      const result = await this.noUserFound(admin_id)
      if (result !== null) {
        return reply.status(404).send({ "message": "No Admin Exist" })
      }
      const userInfo = await this.noUserFound(id)
      if (userInfo !== null) {
        return reply.status(404).send(userInfo)
      }
      try {
        const data = await this.adminRepository.deleteUser(id)
        return reply.status(200).send(JSON.stringify({ "message": data }));
      }
      catch (e) {
        return reply.status(500).send({ "message": "Internal Server Error" });
      }
    }
  }




}