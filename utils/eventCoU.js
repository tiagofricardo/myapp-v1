import axios from "axios";

export default async function eventCoU(id, data) {
  const eventData = { id: id, ...data };

  eventData?.id
    ? await axios
        .put("/api/calendar/events", eventData)
        .then((response) => {
          return response;
        })
        .catch((err) => {
          console.log(err.response.data);
          throw new Error(err.response.data);
        })
    : await axios
        .post("/api/calendar/events", data)
        .then((response) => {
          return response;
        })
        .catch((err) => {
          console.log(err.response.data);
          throw new Error(err.response.data);
        });
}
