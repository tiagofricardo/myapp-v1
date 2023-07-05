import { prisma } from "@/libs/prismadb";

export default async function handler(req, res) {
  async function createService() {
    let serviceResponse, categoryResponse;
    const data = req.body;
    data.price = parseFloat(data.price);

    if (
      data.name === "" ||
      data.description === "" ||
      isNaN(parseFloat(data.price)) ||
      parseFloat(data.price) <= 0 ||
      data.time === "" ||
      data.categoryId === ""
    ) {
      throw new Error("Invalid fields");
    }

    try {
      serviceResponse = await prisma.service.create({ data });
      categoryResponse = await connectCategory(
        data.categoryId,
        serviceResponse.id
      );
    } catch (error) {
      throw new Error("Error creating service");
    }

    return { serviceResponse, categoryResponse };
  }

  async function updateService() {
    const data = req.body;
    data.price = parseFloat(data.price);

    if (
      data.name === "" ||
      data.description === "" ||
      isNaN(parseFloat(data.price)) ||
      parseFloat(data.price) <= 0 ||
      data.time === "" ||
      data.categoryId === ""
    ) {
      throw new Error("Invalid fields");
    }

    try {
      await updateServiceData(data);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function deleteService() {
    const id = req.query.deleteId;

    if (!id) {
      throw new Error("Error deleting the service. Unknown ID");
    }
    try {
      const service = await prisma.service.delete({
        where: { id },
      });
    } catch (err) {
      throw new Error("Error deleting the service");
    }
  }

  async function connectCategory(categoryId, serviceId) {
    try {
      const categoryUpdated = await prisma.category.update({
        where: { id: categoryId },
        data: {
          categories: {
            connect: { id: serviceId },
          },
        },
      });
      return categoryUpdated;
    } catch (error) {
      throw new Error("Error updating category to connect");
    }
  }

  async function updateServiceData(dataToUpdate) {
    try {
      const { id, ...data } = dataToUpdate;
      const service = await prisma.service.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new Error("Error updating service");
    }
  }

  if (req.method === "POST") {
    try {
      const service = await createService();
      return res.status(200).json("Service created successfully");
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  if (req.method === "PUT") {
    try {
      const service = await updateService();
      return res.status(200).json("Service updated successfully");
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  if (req.method === "DELETE") {
    try {
      const service = await deleteService();
      return res.status(200).json("Service deleted successfully");
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  if (req.method === "GET") {
    if (Object.keys(req.query).length === 0) {
      try {
        const services = await prisma.service.findMany();
        return res.status(200).json({ services });
      } catch (error) {
        return res.status(400).json(error);
      }
    }

    try {
      const { page, perPage } = req.query;
      const totalCount = await prisma.service.count();
      const services = await prisma.service.findMany({
        skip: (parseInt(page) - 1) * parseInt(perPage),
        take: parseInt(perPage),
        include: {
          category: true,
        },
      });

      return res.status(200).json({ services, totalCount });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}
