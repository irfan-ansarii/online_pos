"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Page = () => {
  const events = [
    { title: "Meeting", start: new Date("2023-09-05") },
    { title: "Meeting", start: new Date("2023-09-08") },
    { title: "Meeting", start: new Date("2023-09-04") },
  ];

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridWeek"
        events={events}
        weekends={false}
        eventContent={renderEventContent}
      />
    </div>
  );
};

export default Page;
function renderEventContent(eventInfo: any) {
  console.log(eventInfo);
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
