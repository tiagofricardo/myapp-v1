import { prisma } from "@/libs/prismadb";

export default async function handler(req, res) {
  async function createAvailability() {
    let availabilityResponse;

    const { data, activeDays, inactiveDays } = req.body;

    for (let i = 0; i < activeDays.length; i++) {
      try {
        await prisma.availability.deleteMany({
          where: { day: activeDays[i] },
        });
      } catch (err) {
        throw new Error(err.message);
      }
    }

    for (let i = 0; i < inactiveDays.length; i++) {
      try {
        await prisma.availability.updateMany({
          where: { day: inactiveDays[i] },
          data: { isActive: false },
        });
      } catch (err) {
        throw new Error(err.message);
      }
    }

    for (let i = 0; i < data.length; i++) {
      const { id, ...availabilityData } = data[i];
      try {
        availabilityResponse = await prisma.availability.create({
          data: availabilityData,
        });
      } catch (error) {
        throw new Error("Error creating availability time");
      }
    }
  }

  if (req.method === "POST") {
    try {
      const availability = await createAvailability();
      return res.status(200).json("Availability created successfully");
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  if (req.method === "GET") {
    try {
      const availability = await prisma.availability.findMany();
      const organizedData = {};
      for (const obj of availability) {
        const { day, ...dayTimeData } = obj;
        if (!organizedData[day]) {
          organizedData[day] = [];
        }
        organizedData[day].push(dayTimeData);

        if (!organizedData.activeDays) {
          organizedData.activeDays = [];
        }
        if (!organizedData.activeDays.includes(day) && dayTimeData.isActive) {
          organizedData.activeDays.push(day);
        }
      }
      return res.status(200).json(organizedData);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}
