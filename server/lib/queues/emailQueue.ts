import { Queue } from "bullmq";
import {connection} from '../redis';

export interface EmailJobData {
  to: string;
  name: string;
  message: string;
  link: string;
  subject: string;
}

export const emailQueue = new Queue<EmailJobData>("emailQueue", { connection });
