import JoinedEventsOverview from "@/components/events/joinedEventsOverview";
import Header from "@/components/header";
import Head from "next/head";
import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const MyEventsPage: React.FC = () => {
  const { t } = useTranslation();
  return  <>
  <Head>
    <title>My Events - Eventer</title>
    <meta name="description" content="Eventer my events page" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </Head>
  <Header></Header>
    <div className="container">
        <h1>My Events</h1>
        <p>Here you can see all events you have joined</p>
    </div>
    <JoinedEventsOverview></JoinedEventsOverview>
</>;
} 


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { locale } = context;
  
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
    };
  };
  

export default MyEventsPage;