import { Event } from "@/types";
import { useRouter } from "next/router";

type Prop = {
  events: Array<Event>;
};

const EventOverview: React.FC<Prop> = ({ events }: Prop) => {
  const router = useRouter();
  return (
    events && (
      <div className="d-flex flex-wrap">
        {events.map((event) => (
          <div
            key={event.id}
            className="event-card p-3 m-2 border rounded"
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
          </div>
        ))}
      </div>
    )
  );
};

export default EventOverview;
