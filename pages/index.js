import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import Layout from "@/components/common/Layout";
import { endOfDay, format } from "date-fns";
import { pt } from "date-fns/locale";
import { Spinner } from "@/components/common/Spinner";

export default function Home() {
  const { data: user } = useSWR("/api/current", fetcher);
  useSWR;
  const { data, error, isLoading, mutate } = useSWR(
    `/api/calendar/events?startdate=${format(new Date(), "dd MMM yyyy HH:mm", {
      locale: pt,
    })}&enddate=${format(endOfDay(new Date()), "dd MMM yyyy HH:mm", {
      locale: pt,
    })}&hideHolidays=${true}`,
    fetcher
  );

  return (
    <Layout>
      <h1>Welcome {user?.currentUser?.name}</h1>
      <h3>
        For today you have {isLoading ? <Spinner /> : data?.length} event left
      </h3>
    </Layout>
  );
}
