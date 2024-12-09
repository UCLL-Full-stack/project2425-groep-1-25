import EventService from "@/services/EventService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Event, User } from "@/types";
import styles from "@/styles/eventDetails.module.css";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import Header from "@/components/header";

const EventDetails: React.FC = () => {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const fetchEvent = async () => {
    const { id } = router.query;
    const response = await EventService.getEventById(Number(id));
    setEvent(response);
  };

  const fetchUser = async () => {
    const result = sessionStorage.getItem("loggedInUser");
    if (result) {
      setLoggedInUser(JSON.parse(result));
    }
  };

  useEffect(() => {
    fetchUser();
  }, [router.query.id]);

  useEffect(() => {
    if (loggedInUser) {
      fetchEvent();
    }
  });
  const handleOnClick = () => {
    console.log("still need to handle the participate");
  };

  const handleEdit = () => {
    router.push(`edit/${router.query.id}`);
  };

  if (!loggedInUser) {
    return (
      <>
        <Header></Header>
        <p className={styles.error}>Please log in first</p>
      </>
    );
  }
  return (
    event && (
      <>
        <Head>
          <title>{event.name} - Eventer</title>
          <meta name="description" content="Eventer home page" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div>
          <h1 className={styles.title}>{event.name}</h1>

          <div
            key={event.id}
            className="event-card p-3 m-2 border rounded d-flex flex-column justify-content-center"
            onClick={() => {
              router.push(`/events/${event.id}`);
            }}
          >
            {loggedInUser?.role === "Admin" && (
              <button className={styles.editButton} onClick={handleEdit}>
                Edit event
              </button>
            )}
            <p className={styles.p}>
              Date: {new Date(event.date).toLocaleDateString()}
            </p>
            <p className={styles.p}>Price: {event.price}</p>
            <p className={styles.p}>
              Min Participants: {event.minParticipants}
            </p>
            <p className={styles.p}>
              Max Participants: {event.maxParticipants}
            </p>
            {event.location ? (
              <p className={styles.p}>
                Location: {event.location.street} {event.location.number},{" "}
                {event.location.city}, {event.location.country}
              </p>
            ) : (
              <p className={styles.p}>Location: Not available</p>
            )}
            <button
              className={styles.button}
              onClick={() => {
                handleOnClick();
              }}
            >
              <strong>Participate</strong>
            </button>
          </div>
        </div>
      </>
    )
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};
export default EventDetails;
