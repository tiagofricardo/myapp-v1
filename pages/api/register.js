import bcrypt from "bcrypt";
import { prisma } from "@/libs/prismadb";

export default async function handler(req, res) {
  const errors = { User_email_key: "Email already in use." };

  if (req.method != "POST") {
    return res.status(405).end();
  }
  try {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    const mappedError = errors[error.meta.target] ?? "Error registering user";
    return res.status(400).json(mappedError);
  }
}
