import EventService from "@/services/EventService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Event, User } from "@/types";
import styles from "@/styles/eventDetails.module.css";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";

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
    fetchEvent();
    fetchUser();
  }, [router.query.id]);

  return (
    event && (
      <>
        <Head>
          <title>Edit {event.name} - Eventer</title>
          <meta name="description" content="Eventer home page" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
      </>
    )
  );
};
export default EventDetails;