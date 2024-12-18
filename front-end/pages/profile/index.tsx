import Header from "@/components/header";
import ProfileForm from "@/components/profileForm";
import React, { useState } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ProfilePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Profile - Eventer</title>
        <meta name="description" content="Eventer home page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ProfileForm></ProfileForm>
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
export default ProfilePage;
