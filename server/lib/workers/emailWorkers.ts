import * as React from "react";
import { Worker } from "bullmq";
import {notificationEmail} from "../../components/NotificationEmail.js";
import { EmailJobData } from "../queues/emailQueue.js";
import { transporter } from "../mailer.js";
import {connection} from '../redis';

const worker = new Worker<EmailJobData>(
  "emailQueue",
  async (job) => {
    const { to, name, message, link,  subject} = job.data;
      const html = notificationEmail(name, message, link);

        const mailOptions = {
          from: `"Shoppee" <${process.env.GMAIL_USER}>`,
          to,
          subject,
          html,
        };
      
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);


    console.log(`Email sent successfully to ${to}`);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
