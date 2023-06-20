import { prisma } from "@/libs/prismadb";
import { getSession } from "next-auth/react";

const serverAuth = async (req) => {
  const session = await getSession({ req });

  if (!session) {
    return;
  }

  if (!session?.user?.email) {
    throw new Error("Not signed in");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    throw new Error("Not signed in ");
  }

  return { currentUser };
};

export default serverAuth;
