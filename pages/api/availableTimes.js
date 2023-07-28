import { prisma } from "@/libs/prismadb";
import {
  addMinutes,
  endOfDay,
  isBefore,
  isWithinInterval,
  startOfDay,
  subMinutes,
} from "date-fns";

export default async function handler(req, res) {
  const allDaysOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  function updateDates(array, newDate) {
    const newTime = new Date(newDate).getTime();

    for (let i = 0; i < array.length; i++) {
      const startDateTime = new Date(array[i].startTime);
      const endDateTime = new Date(array[i].endTime);

      const startHours = startDateTime.getHours();
      const startMinutes = startDateTime.getMinutes();
      const startSeconds = startDateTime.getSeconds();

      const endHours = endDateTime.getHours();
      const endMinutes = endDateTime.getMinutes();
      const endSeconds = endDateTime.getSeconds();

      startDateTime.setTime(newTime);
      startDateTime.setHours(startHours);
      startDateTime.setMinutes(startMinutes);
      startDateTime.setSeconds(startSeconds);

      endDateTime.setTime(newTime);
      endDateTime.setHours(endHours);
      endDateTime.setMinutes(endMinutes);
      endDateTime.setSeconds(endSeconds);

      array[i].startTime = startDateTime.toISOString();
      array[i].endTime = endDateTime.toISOString();
    }
    return array;
  }

  /***ACTION TO CHECK IF THE DATE AS INPUT IS THE SAME AS THE CURRENT DATE***/

  function isSameDayAsToday(givenDateString) {
    const givenDate = new Date(givenDateString);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const givenYear = givenDate.getFullYear();
    const givenMonth = givenDate.getMonth();
    const givenDay = givenDate.getDate();

    return (
      currentYear === givenYear &&
      currentMonth === givenMonth &&
      currentDay === givenDay
    );
  }

  /***ACTION TO CHECK IF THE DATE AS INPUT HAS AN HOUR BIGGER THAN THE ACTUAL DATE***/

  function isLaterThanCurrentHour(dateTimeString) {
    const currentHour = new Date().getHours();
    const date = new Date(dateTimeString);
    const hour = date.getHours();
    return hour > currentHour;
  }

  /***ACTION GET ALL THE EVENTS***/

  async function getEvents(date) {
    try {
      const eventsWithServices = await prisma.event.findMany({
        where: {
          start: {
            gte: startOfDay(new Date(date)),
            lt: endOfDay(new Date(date)),
          },
        },
      });

      let events = eventsWithServices.map((event) => ({
        id: event.id,
        start: event.start,
        end: event.end,
      }));

      const eventsHolidays = await prisma.holidays.findMany();
      events = [...events, ...eventsHolidays];

      return events;
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  /***ACTION TO GET THE AVAILABILITY***/

  async function getAvailability() {
    try {
      const availabilityTimes = await prisma.availability.findMany();
      const organizedData = {};
      for (const obj of availabilityTimes) {
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

      return organizedData;
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  /***ACTION TO CHECK IF IN THE EVENTS PASSED AND FOR A SERVICE(MINUTES) THE HOUR IS OCCUPIED OR NOT***/

  const isHourOccupied = (events, hourToCheck, serviceMinutes) => {
    const hourToCheckDate = new Date(hourToCheck);
    const hourServiceCheck = addMinutes(hourToCheckDate, serviceMinutes);

    for (const event of events) {
      const eventStart = subMinutes(new Date(event.start), 1);
      const eventEnd = subMinutes(new Date(event.end), 1);

      if (
        isWithinInterval(hourToCheckDate, {
          start: eventStart,
          end: eventEnd,
        }) ||
        isWithinInterval(hourServiceCheck, {
          start: eventStart,
          end: eventEnd,
        })
      ) {
        return true;
      }
    }

    return false;
  };

  /***ACTION TO GET THE AVAILABLE HOURS***/

  const getHoursWithInterval = async (
    data,
    intervalMinutes,
    events,
    serviceMinutes
  ) => {
    const result = [];

    data.forEach((entry) => {
      const startTime = new Date(entry.startTime);
      const endTime = new Date(entry.endTime);

      let currentHour = startTime;

      while (isBefore(currentHour, endTime)) {
        if (!isHourOccupied(events, currentHour, serviceMinutes)) {
          result.push(currentHour);
        }
        currentHour = addMinutes(currentHour, intervalMinutes);
      }
    });

    return result;
  };

  if (req.method === "GET") {
    if (Object.keys(req.query).length === 0) {
      return res.status(200).json("[]");
    }

    const { date, serviceMinutes } = req.query;

    const events = await getEvents(date);
    const availability = await getAvailability();

    const dayOfWeek = allDaysOfWeek[new Date(date).getDay()];
    const dayAvailability = availability[dayOfWeek];

    const dayAvailabilityCurrentDate = await updateDates(dayAvailability, date);

    const hoursArray = await getHoursWithInterval(
      dayAvailabilityCurrentDate,
      30,
      events,
      serviceMinutes
    );

    if (isSameDayAsToday(date)) {
      const filteredArray = hoursArray.filter(isLaterThanCurrentHour);
      return res.status(200).json(filteredArray);
    }

    return res.status(200).json(hoursArray);
  }
}
