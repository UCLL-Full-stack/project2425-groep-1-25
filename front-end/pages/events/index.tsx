import Head from "next/head";
import styles from "@/styles/home.module.css";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import EventService from "@/services/EventService";
import { Event, User } from "@/types";
import { useRouter } from "next/router";
import EventOverview from "@/components/events/EventOverview";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import useSWR from "swr";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [err, setError] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await EventService.getAllEvents();
      return response;
    } catch (error) {
      setError(`Error: Failed to fetch events`);
    }
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
    data: events,
    isLoading,
    error,
  } = useSWR("fetchEvents", async () => fetchEvents());
  if (isLoading)
    return (
      <>
        <Head>
          <title>Loading events - Eventer</title>{" "}
          <meta name="description" content="Eventer events page" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Header />
        <main className={styles.main}>
          <p>Loading</p>
        </main>
      </>
    );
  return (
    <>
      <Head>
        <title>Events - Eventer</title>
        <meta name="description" content="Eventer events page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className={styles.main}>
        {isUserLoaded && error && (
          <strong className={styles.error}>{error}</strong>
        )}
        {isUserLoaded == true && !loggedInUser && (
          <strong className={styles.error}>Please log in first</strong>
        )}
        <EventOverview events={events} />
        <button
          className="btn btn-primary"
          onClick={() => {
            router.push("/add-event");
          }}
        >
          {t("event.button")}
        </button>
      </main>
    </>
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

export default Home;
