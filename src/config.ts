import dotenv from 'dotenv'
dotenv.config()

const mailPassword: any = process.env.mailPassword
const dbPassword: any = process.env.dbPassword
const dbPort: any = process.env.dbPort
const dbUser: any = process.env.dbUser
const host: any = process.env.host
const ACCESS_TOKEN_SECRET: any = process.env.ACCESS_TOKEN_SECRET
const sendingMail: any = process.env.sendingMail
const PORT: any = process.env.PORT

export {
    mailPassword,
    dbPassword,
    dbPort,
    dbUser,
    host,
    ACCESS_TOKEN_SECRET,
    sendingMail,
    PORT
}