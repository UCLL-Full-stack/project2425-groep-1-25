import Head from "next/head";
import styles from "@/styles/home.module.css";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { useRouter } from "next/router";
import EventOverview from "@/components/events/EventOverview";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const Home: React.FC = () => {
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

  return (
    <>
      <Head>
        <title>Events - Eventer</title>
        <meta name="description" content="Eventer events page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className={styles.main}>
        {isUserLoaded == true && !loggedInUser && (
          <strong className={styles.error}>{t("general.loginerror")}</strong>
        )}
        <EventOverview />
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
