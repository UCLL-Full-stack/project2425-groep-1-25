import Head from "next/head";
import Header from "@/components/header";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import EventService from "@/services/EventService";
import router, { useRouter } from "next/router";
import EventDetail from "@/components/events/EventDetails";

const EventDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const fetchEvent = async () => {
    return await EventService.getEventById(Number(id));
  };
  const fetchParticipants = async () => {
    return await EventService.getEventParticipants(Number(id));
  };

  return (
    <>
      <Head>
        <title>Event details - Eventer</title>
        <meta name="description" content="Eventer home page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header></Header>
      <EventDetail eventid={Number(id)} />
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
export default EventDetails;
