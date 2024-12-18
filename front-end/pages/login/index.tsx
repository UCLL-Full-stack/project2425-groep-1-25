import Header from "@/components/header";
import LoginForm from "@/components/loginForm";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("login.title")}</title>
        <meta name="description" content="Eventer home page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header></Header>
      <LoginForm></LoginForm>
      <div>
        <table className="table border-separate border border-black-800"> 
          <thead>
            <tr>
              <th>Username</th>
              <th>Password</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jefke</td>
              <td>Test123</td>
              <td>User</td>
            </tr>
            <tr>
              <td>admin</td>
              <td>admin123</td>
              <td>Admin</td>
            </tr>
            <tr>
              <td>mod</td>
              <td>mod123</td>
              <td>Mod</td>
            </tr>
          </tbody>
        </table>
      </div>
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
export default LoginPage;
