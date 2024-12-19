import EventService from "@/services/EventService";
import styles from "@/styles/eventDetails.module.css";
import { User } from "@/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Prop = {
  eventid: number;
};
const EventDetail: React.FC<Prop> = ({ eventid }: Prop) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState<String>("");

  const fetchEvent = async () => {
    return await EventService.getEventById(Number(eventid));
  };
  const fetchParticipants = async () => {
    return await EventService.getEventParticipants(Number(eventid));
  };

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

  const {
    data: participants,
    isLoading: isLoadingParticipants,
    error: errorParticipants,
  } = useSWR(
    eventid ? `Fetch participants ${eventid}` : null,
    fetchParticipants
  );

  const {
    data: event,
    isLoading: isLoadingEvent,
    error: errorEvent,
  } = useSWR(eventid ? `Fetch event ${eventid}` : null, fetchEvent);

  const handleOnClick = () => {
    if (!loggedInUser) {
      throw new Error("User not logged in");
    }
    EventService.joinEvent(Number(eventid))
      .then(() => {
        router.push("/events");
      })
      .catch((error: Error) => {
        setStatusMessage(error.message);
      });
  };

  const handleEdit = () => {
    router.push(`edit/${eventid}`);
  };

  if (!loggedInUser) {
    return (
      <>
        <p className={styles.error}>{t("event.details.loginerror")}</p>
      </>
    );
  }
  if (errorEvent) return <div>{errorEvent}</div>;
  if (errorParticipants) return <div>{errorParticipants}</div>;
  if (isLoadingParticipants || isLoadingEvent)
    return <div>{t("general.loading")}</div>;

  return (
    <div>
      <h1 className={styles.title}>{event.name}</h1>

      <div
        key={event.id}
        className="event-card p-3 m-2 border rounded d-flex flex-column justify-content-center"
      >
        {(loggedInUser.role === "Admin" || loggedInUser.role === "Mod") && (
          <button className={styles.editButton} onClick={handleEdit}>
            {t("event.details.editeventbutton")}
          </button>
        )}
        <p className={styles.p}>
          {t("event.details.date")}
          {new Date(event.date).toLocaleDateString()}
        </p>
        <p className={styles.p}>
          {t("event.details.price")} {event.price}
        </p>
        <p className={styles.p}>
          {t("event.details.minparticipants")} {event.minParticipants}
        </p>
        <p className={styles.p}>
          {t("event.details.maxparticipants")} {event.maxParticipants}
        </p>

        <p className={styles.p}>
          {t("event.details.location")} {event.location.street}{" "}
          {event.location.number}, {event.location.city},{" "}
          {event.location.country}
        </p>
        <p className={styles.p}>
          {t("event.details.category")} {event.category.name}
        </p>
        <p className={styles.p}>
          {t("event.details.participants")} {participants}
        </p>
        <button
          className={styles.button}
          onClick={() => {
            handleOnClick();
          }}
        >
          <strong>{t("event.details.participate")}</strong>
        </button>
        {statusMessage && (
          <>
            <p className={styles.error}>{statusMessage}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
