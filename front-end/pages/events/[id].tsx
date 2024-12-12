import EventService from "@/services/EventService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Event, User } from "@/types";
import styles from "@/styles/eventDetails.module.css";
import Head from "next/head";
import Header from "@/components/header";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const EventDetails: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [event, setEvent] = useState<Event | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const { id } = router.query;

  const fetchEvent = async () => {
    const response = await EventService.getEventById(Number(id));
    setEvent(response);
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
  useEffect(() => {
    if (id && isUserLoaded && loggedInUser) {
      fetchEvent();
    }
  }, [isUserLoaded, id]);
  const handleOnClick = () => {
    console.log("still need to handle the participate");
  };

  const handleEdit = () => {
    router.push(`edit/${id}`);
  };

  if (!loggedInUser) {
    return (
      <>
        <Head>
          <title>Event details - Eventer</title>
          <meta name="description" content="Eventer home page" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Header></Header>
        <p className={styles.error}>{t("event.details.loginerror")}</p>
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
        <Header></Header>
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
              {t("event.details.date")}{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className={styles.p}>Price: {event.price}</p>
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
            <button
              className={styles.button}
              onClick={() => {
                handleOnClick();
              }}
            >
              <strong>{t("event.details.participate")}</strong>
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
