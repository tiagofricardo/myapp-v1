import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { useMediaQuery } from "react-responsive";
import EventModal from "./EventModal";
import fetcher from "@/libs/fetcher";
import useSWR from "swr";
import AppModal from "../common/Modal";
import { pt } from "date-fns/locale";
import { format } from "date-fns";
import eventCoU from "@/utils/eventCoU";
import { toasterOptions } from "@/utils/toaster/toasterOptions";
import { toast } from "react-toastify";

export default function CalendarJobs({ servicesOptions }) {
  const calendarRef = useRef(null);
  const [currView, setCurrView] = useState("dayGridMonth");
  let isTab = useMediaQuery({ query: "(max-width: 768px)" });
  const { data, error, isLoading, mutate } = useSWR(
    `/api/calendar/events?month=06&year=2023`,
    fetcher
  );
  const [confirmationModalIsOn, setConfirmationModalIsOn] = useState(false);
  const [confirmationModalData, setConfirmationModalData] = useState();
  const [eventModalIsOn, setEventModalIsOn] = useState(false);
  const [modalEventData, setmodalEventData] = useState();

  function toggleEventModal(isOpen) {
    setEventModalIsOn(isOpen);
  }

  function toggleConfirmationModal(isOpen) {
    setConfirmationModalIsOn(isOpen);
  }

  function handleOnEventModalAction() {
    toggleEventModal(false);
    mutate();
  }

  function handleDateClick(data) {
    console.log("DATA CLICK", data);
    setmodalEventData(data);
    toggleEventModal(true);
  }

  function handleEventChange(events) {
    console.log(events);
    toggleConfirmationModal(true);
    setConfirmationModalData(events);
  }

  function handleEventClick({ event }) {
    const teste = { ...event };
    setmodalEventData(event);
    toggleEventModal(true);
  }

  function handleViewChange(ev) {
    const newView = ev.view.type;
    if (newView !== currView) {
      setTimeout(() => {
        calendarRef.current.getApi().render();
      }, 1);
      setCurrView(newView);
    }
  }

  async function onChangeEvent() {
    const data = {
      name: confirmationModalData.event.title,
      email: confirmationModalData.event.extendedProps.email,
      phonenumber: confirmationModalData.event.extendedProps.phonenumber,
      startDatePicker: confirmationModalData.event.start,
      endDatePicker: confirmationModalData.event.end,
      serviceId: confirmationModalData.event.extendedProps.serviceId,
    };

    try {
      const response = await eventCoU(confirmationModalData?.event?.id, data);
      toast.success("Event updated successfully", {
        ...toasterOptions,
      });
      mutate();
      toggleConfirmationModal(false);
    } catch (err) {
      toast.error(err.message, {
        ...toasterOptions,
      });
    }
  }

  function renderEventContent(eventInfo) {
    return (
      <>
        <div className="w-full  flex flex-col">
          <div className="block">
            <b>{eventInfo.timeText}</b>
          </div>
          <div className="">
            <i className="text-tertiary">{eventInfo.event.title}</i>
            {console.log(eventInfo.event.extendedProps)}
            {eventInfo.event.extendedProps.name && (
              <p className="truncate">{eventInfo.event.extendedProps.name}</p>
            )}
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        locale="Locale"
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: isTab
            ? "listDay,listWeek"
            : "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        nowIndicator={true}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          listDay: "Dia",
          listWeek: "semana",
          dayGridMonth: "Month",
          dayGridWeek: "Semana",
          dayGridDay: "Dia",
        }}
        editable={true}
        dayMaxEvents={true}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
        eventClassNames="truncate gap-2"
        moreLinkClassNames="text-primary"
        events={data}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
        eventChange={handleEventChange}
        eventClick={handleEventClick}
        viewDidMount={handleViewChange}
      />
      <EventModal
        isOpen={eventModalIsOn}
        onClose={toggleEventModal}
        onEventChange={handleOnEventModalAction}
        title={`${
          modalEventData?.id
            ? "Update event " + modalEventData.title
            : "Create event"
        }`}
        eventDataClick={modalEventData}
        servicesOptions={servicesOptions}
      />
      <AppModal
        isOpen={confirmationModalIsOn}
        onClose={toggleConfirmationModal}
        title={`Event ${confirmationModalData?.event?.title}`}
        description={
          <>
            <p>Event data will be changed from: </p>

            {confirmationModalData?.oldEvent ? (
              <>
                <p className="my-2">
                  Initial date:{" "}
                  {format(
                    new Date(confirmationModalData?.oldEvent?.start),
                    "dd MMM yyyy HH:mm",
                    {
                      locale: pt,
                    }
                  )}
                  {" - "}
                  {format(
                    new Date(confirmationModalData?.oldEvent?.end),
                    "dd MMM yyyy HH:mm",
                    {
                      locale: pt,
                    }
                  )}
                </p>
                <p className="font-semibold">
                  Final date:{" "}
                  {format(
                    new Date(confirmationModalData?.event?.start),
                    "dd MMM yyyy HH:mm",
                    {
                      locale: pt,
                    }
                  )}
                  -
                  {format(
                    new Date(confirmationModalData?.event?.end),
                    "dd MMM yyyy HH:mm",
                    {
                      locale: pt,
                    }
                  )}
                </p>
              </>
            ) : (
              ""
            )}
          </>
        }
        bt1Text={"Cancel"}
        bt2Text={"Confirm"}
        action={() => {
          onChangeEvent();
        }}
      />
    </>
  );
}
