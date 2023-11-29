import nodemailer from "nodemailer"
import { sendingMail, mailPassword } from "../config"

export class EmailServices {

    async sendEmail(userName: string, userEmail: string) {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: sendingMail,
                pass: mailPassword
            }
        });
        const emailContent = `
            <html>
                <head>
                    <style>
                     
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            text-align: left; 
                        }
                        h1 {
                            color: #333;
                            text-align: center;
                        }
                        p {
                            color: #666;
                            text-align: left; /* Align paragraphs to the left */
                            font-size: 18px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Welcome to Centralize Shopping</h1>
                        <p>Dear ${userName},</p>
                        <p>Thank you for joining Centralize Shopping!</p>
                        <p>If you have any questions or need assistance, please don't hesitate to contact our support team at centralizeshopping@gmail.com.</p>
                        <p>Happy shopping!</p>
                    </div>
                </body>
            </html>
        `;


        // Define email options
        const mailOptions = {
            from: sendingMail,
            to: userEmail,
            subject: 'Welcome to Centralize Shopping',
            html: emailContent
        };

        await transporter.sendMail(mailOptions);


    }

}