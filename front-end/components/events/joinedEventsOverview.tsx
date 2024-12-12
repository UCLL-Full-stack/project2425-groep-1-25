import ProfileService from "@/services/ProfileService";
import React from "react";
import useSWR from "swr";

const JoinedEventsOverview: React.FC = () => {
  const getJoinedEvents = async () => {
    const data = await ProfileService.getEventsByUserName();
    return data;
  };

  const { data: joinedEvents, isLoading, error } = useSWR("getJoinedEvents", getJoinedEvents);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {joinedEvents && (
        <div className="d-flex flex-wrap">
          {joinedEvents.map((event: { id: React.Key | null | undefined; name: string; date: string | number | Date; price: string | number; minParticipants: string | number; maxParticipants: string | number; location: { street: string; number: string | number; postalCode: string; city: string; }; }) => (
            <div key={event.id} className="event-card p-3 m-2 border rounded">
              <h2>{event.name}</h2>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Price: {event.price}</p>
              <p>Min Participants: {event.minParticipants}</p>
              <p>Max Participants: {event.maxParticipants}</p>
              {event.location ? (
                <p>
                  Location: {event.location.street} {event.location.number},{" "}
                  {event.location.postalCode} {event.location.city}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default JoinedEventsOverview;