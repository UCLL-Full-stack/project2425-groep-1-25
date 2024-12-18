import EventService from "@/services/EventService";
import ProfileService from "@/services/ProfileService";
import { Event, User } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Prop = {
  events: Array<Event>;
};

const EventOverview: React.FC<Prop> = ({ events }: Prop) => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const fetchUser = async () => {
    const result = sessionStorage.getItem("loggedInUser");
    if (result) {
      setLoggedInUser(JSON.parse(result));
    }
    setIsUserLoaded(true);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const getJoinedEvents = async () => {
    const data = await EventService.getEventsByParticipant();
    return data;
  };
  const isJoined = (eventId: number) => {
    return joinedEvents.some((event: Event) => event.id === eventId);
  };
  const {
    data: joinedEvents,
    isLoading,
    error,
  } = useSWR("getJoinedEvents", getJoinedEvents);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error while fetching events</div>;

  return (
    events && (
      <div className="d-flex flex-wrap">
        {events.map((event) => (
          <div
            key={event.id}
            className={`event-card p-3 m-2 border rounded ${
              event.id !== undefined && isJoined(event.id) ? "joined" : ""
            }`}
            onClick={() => {
              router.push(`/events/${event.id}`);
            }}
          >
            <h2>{event.name}</h2>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Price: {event.price}</p>
            <p>Min Participants: {event.minParticipants}</p>
            <p>Max Participants: {event.maxParticipants}</p>
            {event.location ? (
              <p>
                Location: {event.location.street} {event.location.number},{" "}
                {event.location.city}, {event.location.country}
              </p>
            ) : (
              <p>Location: Not available</p>
            )}
            {event.id !== undefined && isJoined(event.id) && (
              <p className="joined-text px-4 fs-5 text-red-500">
                You have joined this event
              </p>
            )}
          </div>
        ))}
      </div>
    )
  );
};

export default EventOverview;
