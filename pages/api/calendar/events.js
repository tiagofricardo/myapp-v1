import { prisma } from "@/libs/prismadb";
import { isValid } from "date-fns";
export default async function handler(req, res) {
  function checkData(data) {
    if (isNaN(data.phonenumber)) {
      throw new Error("Phone number invalid");
    }
    data.phonenumber = parseInt(data.phonenumber);
    if (
      !isValid(new Date(data.startDatePicker)) ||
      !isValid(new Date(data.endDatePicker)) ||
      new Date(data.startDatePicker) >= new Date(data.endDatePicker)
    ) {
      throw new Error("Invalid dates");
    }
    data.start = new Date(data.startDatePicker);
    delete data.startDatePicker;
    data.end = new Date(data.endDatePicker);
    delete data.endDatePicker;

    if (data.name === "" || data.description === "" || data.serviceId === "") {
      throw new Error("Invalid fields");
    }
    return data;
  }

  async function connectService(serviceId, eventId) {
    try {
      const serviceUpdated = await prisma.service.update({
        where: { id: serviceId },
        data: {
          events: {
            connect: { id: eventId },
          },
        },
      });
      return serviceUpdated;
    } catch (error) {
      throw new Error("Error updating service to connect");
    }
  }

  async function createEvent() {
    let eventResponse;
    let serviceResponse;
    const reqData = req.body;

    const data = checkData(reqData);
    console.log(data);
    eventResponse = await prisma.event.create({ data });
    serviceResponse = await connectService(data.serviceId, eventResponse.id);
  }

  async function deleteEvent() {
    const id = req.query.id;

    if (!id) {
      throw new Error("Error deleting the event. Unknown ID");
    }
    try {
      const event = await prisma.event.delete({
        where: { id },
      });
    } catch (err) {
      throw new Error("Error deleting the event");
    }
  }

  if (req.method === "GET") {
    const { month, year } = req.query;

    try {
      const eventsWithServices = await prisma.event.findMany({
        where: {
          start: {
            gte: new Date(`${year}-${month}-01`),
            lt: new Date(new Date(`${year}-${month}-01`).setMonth(month)),
          },
        },
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      });

      const events = eventsWithServices.map((event) => ({
        id: event.id,
        title: event.service.name,
        name: event.name,
        email: event.email,
        phonenumber: event.phonenumber,
        start: event.start,
        end: event.end,
        serviceId: event.service.id,
        color: event.service.category.colorRef,
      }));

      return res.status(200).json(events);
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }

  if (req.method === "POST") {
    try {
      await createEvent();
      return res.status(200).json("Event created successfully");
    } catch (err) {
      console.log(err);
      return res.status(400).json(err.message);
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, ...data } = req.body;

      checkData(data);
      console.log(data);

      const event = await prisma.event.update({
        where: { id },
        data,
      });
      return res.status(200).json("Event updated successfully");
    } catch (err) {
      console.log(err.message);
      return res.status(400).json(err.message);
    }
  }

  if (req.method === "DELETE") {
    try {
      const event = await deleteEvent();
      return res.status(200).json("Event deleted successfully");
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }
}
