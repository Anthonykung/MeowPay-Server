'use server';

/**
 * @name sendEmail
 * @description Sends an email using nodemailer
 * @author Anthony Kung <hi@anth.dev> (https://anth.dev)
 * @license Apache-2.0
 * @param {string} to - The email address of the recipient
 * @param {string} from - The email address of the sender
 * @param {string} subject - The subject of the email
 * @param {string} text - The text content of the email
 * @param {string} html - The HTML content of the email
 * @returns {Promise} A promise that resolves when the email is sent
 *
 * @example
 * import email from '@/lib/email';
 *
 * await email({
 *   to: '',
 *   from: '',
 *   subject: '',
 *   text: '',
 *   html: '',
 * });
 */

import nodemailer from 'nodemailer';

export default async function sendEmail({
  to,
  from,
  replyTo,
  subject,
  text,
  html,
}: {
  to: string
  from?: string
  replyTo?: string
  subject: string
  text: string
  html: string
}) {

  if (!from) {
    from = process.env.EMAIL_USERNAME as string;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: Number(process.env.EMAIL_PORT as string),
    auth: {
      user: process.env.EMAIL_USERNAME as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  });

  try {
    await transporter.sendMail({
      to: to,
      from: process.env.EMAIL_USERNAME as string,
      sender: from,
      replyTo: replyTo || from,
      subject: subject,
      text: text,
      html: html,
    });

    return true;
  }
  catch (err) {
    console.error(err);
    return false;
  }
}