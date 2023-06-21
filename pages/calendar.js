import CalendarJobs from "@/components/calendar/CalendarJobs";
import Layout from "@/components/common/Layout";
import axios from "axios";

export default function Calendar({ servicesOptions }) {
  return (
    <Layout>
      <CalendarJobs servicesOptions={servicesOptions} />
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const response = await axios.get(`${process.env.APP_URL}/api/services`);
    const servicesOptions = response.data.services.map(({ id, name }) => ({
      label: name,
      value: id,
    }));

    return {
      props: {
        servicesOptions,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      props: {
        servicesOptions: [],
      },
    };
  }
}
