import { prisma } from "@/libs/prismadb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, colorRef, description, image } = req.body;
      const category = await prisma.category.create({
        data: {
          name,
          colorRef,
          description,
          image,
        },
      });
      return res.status(200).json(category);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, name, colorRef, description, image } = req.body;
      if (!id) {
        return res.status(400).json("ID not found");
      }
      const category = await prisma.category.update({
        where: { id },
        data: {
          name,
          colorRef,
          description,
          image,
        },
      });
      return res.status(200).json(category);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  if (req.method === "GET") {
    if (Object.keys(req.query).length === 0) {
      try {
        const categories = await prisma.category.findMany();
        return res.status(200).json({ categories });
      } catch (error) {
        console.log(error);
        return res.status(400).json(error);
      }
    }
    const { page, perPage } = req.query;

    try {
      const totalCount = await prisma.category.count();
      const categories = await prisma.category.findMany({
        skip: (parseInt(page) - 1) * parseInt(perPage),
        take: parseInt(perPage),
      });

      return res.status(200).json({ categories, totalCount });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  if (req.method === "DELETE") {
    try {
      const id = req.query.deleteId;
      if (!id) {
        return res.status(400).json("ID not found");
      }
      const category = await prisma.category.delete({
        where: { id },
      });
      return res.status(200).json("");
    } catch (error) {
      return res.status(400).json("Error deleting the record");
    }
  }
}
