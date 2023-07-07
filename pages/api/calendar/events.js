import { prisma } from "@/libs/prismadb";
import { addDays, isValid, setHours, setMinutes } from "date-fns";
import { differenceInCalendarDays } from "date-fns/fp";
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

  async function getHolidays() {
    let holidays = [];
    const eventsHolidays = await prisma.holidays.findMany();
    eventsHolidays.forEach((holiday) => {
      const start = new Date(holiday.start);
      const end = new Date(holiday.end);
      if (differenceInCalendarDays(start, end) >= 3) {
        const startDayComplete = setMinutes(setHours(start, 23), 59);
        0;
        const startNextDay = setMinutes(setHours(addDays(start, 1), 0), 0);
        const endDayPreviousComplete = setMinutes(
          setHours(addDays(end, -1), 24),
          59
        );
        0;
        const endStartDay = setMinutes(setHours(end, 0), 0);

        const firstObject = {
          start: start,
          end: startDayComplete,
          display: "background",
        };
        holidays.push(firstObject);

        const secondObject = {
          start: startNextDay,
          end: endDayPreviousComplete,
          display: "background",
          allDay: "true",
        };
        holidays.push(secondObject);

        const thirdObject = {
          start: endStartDay,
          end: end,
          display: "background",
        };
        holidays.push(thirdObject);
      } else {
        const object = {
          start: start,
          end: end,
          display: "background",
        };
        holidays.push(object);
      }
    });

    return holidays;
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
    const { startdate, enddate, hideHolidays } = req.query;

    try {
      const eventsWithServices = await prisma.event.findMany({
        where: {
          start: {
            gte: new Date(startdate),
            lt: new Date(enddate),
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

      let events = eventsWithServices.map((event) => ({
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

      if (hideHolidays === "true") {
        return res.status(200).json(events);
      }

      const holidays = await getHolidays();
      events = [...events, ...holidays];

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
      return res.status(400).json(err.message);
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, ...data } = req.body;

      checkData(data);

      const event = await prisma.event.update({
        where: { id },
        data,
      });
      return res.status(200).json("Event updated successfully");
    } catch (err) {
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
