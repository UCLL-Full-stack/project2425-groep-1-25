import EventService from "@/services/EventService";
import { Event, User } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import useSWR from "swr";
import React from "react";

const EventOverview: React.FC = () => {
  const { t } = useTranslation();
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
  const fetchEvents = async () => {
    const response = await EventService.getAllEvents();
    return response;
  };
  const getJoinedEvents = async () => {
    const data = await EventService.getEventsByParticipant();
    return data;
  };
  const isJoined = (eventId: number) => {
    return joinedEvents.some((event: Event) => event.id === eventId);
  };
  const {
    data: joinedEvents,
    isLoading: isLoadingJoinedEvents,
    error: errorJoinedEvents,
  } = useSWR("getJoinedEvents", getJoinedEvents);

  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorEvents,
  } = useSWR("fetchEvents", async () => fetchEvents());

  if ((isLoadingEvents || isLoadingJoinedEvents) && loggedInUser)
    return <div>{t("general.loading")}</div>;
  if ((errorEvents || errorJoinedEvents) && loggedInUser)
    return <div>{t("general.error")}</div>;
  return (
    events && (
      <div className="d-flex flex-wrap">
        {events.map((event: Event) => (
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
            <p>
              {t("event.details.date")}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              {t("event.details.price")} {event.price}
            </p>
            <p>
              {t("event.details.minparticipants")}
              {event.minParticipants}
            </p>
            <p>
              {t("event.details.maxparticipants")}
              {event.maxParticipants}
            </p>
            <p>
              {t("event.details.location")} {event.location.street}{" "}
              {event.location.number}, {event.location.city},{" "}
              {event.location.country}
            </p>
            {event.id !== undefined && isJoined(event.id) && (
              <p className="joined-text px-4 fs-5 text-red-500">
                {t("event.details.joined")}
              </p>
            )}
          </div>
        ))}
      </div>
    )
  );
};

export default EventOverview;
