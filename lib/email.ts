"use server";
import { getOption } from "@/actions/option-actions";
import { MailtrapClient } from "mailtrap";

/**
 * Sends an email using MailtrapClient.
 * @param {string} toEmail
 * @param {string} subject
 * @param {string} content
 * @returns { Promise data: SendResponse, message: string; }
 */
export async function sendEmail(
  toEmail: string,
  subject: string,
  content: { text?: string; html?: string }
) {
  const { data }: any = await getOption("emailMessage");

  const TOKEN = data?.value?.apiToken;

  if (!data || !data?.value || !TOKEN) {
    throw new Error("Email setup is incomplete");
  }

  const { fromName, fromEmail } = data.value;
  const client = new MailtrapClient({ token: TOKEN });

  const sender = { name: fromName, email: fromEmail };

  try {
    const response = await client.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: subject,
      ...content,
    });

    return { data: response, message: "success" };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
