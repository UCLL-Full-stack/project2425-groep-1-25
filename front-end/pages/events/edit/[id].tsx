import EventService from "@/services/EventService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Event, User } from "@/types";
import Head from "next/head";
import styles from "@/styles/home.module.css";
import EditEventForm from "@/components/events/editEventForm";
import Header from "@/components/header";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSWR from "swr";

const EditEventPage: React.FC = () => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const { id } = router.query;

  const fetchEvent = async () => {
    const response = await EventService.getEventById(Number(id));
    return response;
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
    data: event,
    isLoading,
    error,
  } = useSWR("fetchEvent", async () => fetchEvent());
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    event && (
      <>
        <Head>
          <title>Edit {event.name} - Eventer</title>
          <meta name="description" content="Eventer home page" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Header></Header>
        <main className={styles.main}>
          <EditEventForm event={event}></EditEventForm>
        </main>
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
export default EditEventPage;
