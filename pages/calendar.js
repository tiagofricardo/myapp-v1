import CalendarJobs from "@/components/calendar/CalendarJobs";
import Layout from "@/components/common/Layout";
import axios from "axios";
import { format } from "date-fns";

export default function Calendar({ servicesOptions, availabilityTimes }) {
  return (
    <Layout>
      <CalendarJobs
        servicesOptions={servicesOptions}
        availabilityTimes={availabilityTimes}
      />
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const responseAvailability = await axios.get(
      `${process.env.APP_URL}/api/availability`
    );
    const daysOfWeek = {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
      SUNDAY: 0,
    };
    const availabilityTimes = [];
    for (const day in responseAvailability.data) {
      if (day !== "activeDays") {
        const dayOfWeek = daysOfWeek[day];
        const timeSlots = responseAvailability.data[day];

        const formattedTimeSlots = timeSlots.map(({ startTime, endTime }) => ({
          daysOfWeek: [dayOfWeek],
          startTime: format(new Date(startTime), "HH:mm"),
          endTime: format(new Date(endTime), "HH:mm"),
        }));
        formattedTimeSlots.forEach((timeSlot) => {
          availabilityTimes.push(timeSlot);
        });
      }
    }

    const responseServices = await axios.get(
      `${process.env.APP_URL}/api/services`
    );
    const servicesOptions = responseServices.data.services.map(
      ({ id, name }) => ({
        label: name,
        value: id,
      })
    );

    return {
      props: {
        servicesOptions,
        availabilityTimes,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      props: {
        servicesOptions: [],
        availabilityTimes: [],
      },
    };
  }
}
