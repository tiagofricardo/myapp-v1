import { prisma } from "@/libs/prismadb";

export default async function handler(req, res) {
  async function validateDates(data) {
    console.log(data?.id, data.start, data.end);
    const overlappingHolidays = await prisma.holidays.findMany({
      where: {
        id: {
          not: data.id,
        },

        OR: [
          { start: { lte: data.end }, end: { gte: data.start } },
          { start: { gte: data.start, lte: data.end } },
        ],
      },
    });

    if (overlappingHolidays.length > 0) {
      throw new Error("There are overlapping holidays");
    }
  }

  async function createHoliday() {
    const data = req.body;
    const { id, ...dataHolidays } = req.body;
    try {
      await validateDates(data);
    } catch (err) {
      throw new Error(err.message);
    }

    try {
      await prisma.holidays.create({ data: dataHolidays });
    } catch (error) {
      throw new Error("Error creating holiday");
    }
  }

  async function updateHoliday() {
    const data = req.body;
    const { id, ...dataHolidays } = req.body;
    try {
      await validateDates(data);
    } catch (err) {
      throw new Error(err.message);
    }

    try {
      await prisma.holidays.update({
        where: {
          id: id,
        },
        data: dataHolidays,
      });
    } catch (error) {
      throw new Error("Error updating holiday");
    }
  }

  async function deleteHoliday() {
    const id = req.query.deleteId;
    if (!id) {
      throw new Error("Error deleting holiday. Unknown ID");
    }
    try {
      const holiday = await prisma.holidays.delete({
        where: { id },
      });
    } catch (err) {
      throw new Error("Error deleting the holiday");
    }
  }

  if (req.method === "POST") {
    try {
      const holiday = await createHoliday();
      return res.status(200).json("Holiday created successfully");
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  if (req.method === "PUT") {
    try {
      const holiday = await updateHoliday();
      return res.status(200).json("Holiday updated successfully");
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  if (req.method === "GET") {
    if (Object.keys(req.query).length === 0) {
      try {
        const holidays = await prisma.holidays.findMany();
        return res.status(200).json({ holidays });
      } catch (error) {
        return res.status(400).json(error);
      }
    }

    try {
      const { page, perPage } = req.query;
      const totalCount = await prisma.holidays.count();
      const holidays = await prisma.holidays.findMany({
        skip: (parseInt(page) - 1) * parseInt(perPage),
        take: parseInt(perPage),
        orderBy: {
          end: "desc",
        },
      });

      return res.status(200).json({ holidays, totalCount });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  if (req.method === "DELETE") {
    try {
      const holiday = await deleteHoliday();
      return res.status(200).json("Holiday deleted successfully");
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }
}
