import Link from "next/link";
import styles from "@/styles/Header.module.css";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Language from "./Language";
import { User } from "@/types";
const Header: React.FC = () => {
  const { t } = useTranslation();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    const user = sessionStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  };
  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  };

  return (
    <header className={` p-3 mb-3 border-bottom ${styles.custom_gradient}`}>
      <a className="fs-2 d-flex justify-content-center mb-2 mb-lg-0 text-white text-decoration-none">
        {t("header.name")}
      </a>
      <section className="d-flex justify-content-center">
        <nav className="nav justify-content-center">
          <Link href="/" className="nav-link px-4 fs-5 text-white">
            {t("header.nav.home")}
          </Link>
          <Link href="/events" className="nav-link px-4 fs-5 text-white">
            {t("header.nav.events")}
          </Link>
          {!loggedInUser && (
            <>
              <Link href="/register" className="nav-link px-4 fs-5 text-white">
                {t("header.nav.register")}
              </Link>
              <Link href="/login" className="nav-link px-4 fs-5 text-white">
                {t("header.nav.login")}
              </Link>
            </>
          )}
          {loggedInUser && (
            <>
              <Link href="/my-events" className="nav-link px-4 fs-5 text-white">
                {t("header.nav.myEvents")}
              </Link>
              <Link
                href="/login"
                onClick={handleLogout}
                className="nav-link px-4 fs-5 text-white"
              >
                {t("header.nav.logout")}
              </Link>
              <p className="text-white fs-5 px-4 nav-link">
                {t("header.welcome")} {loggedInUser.userName}
              </p>
            </>
          )}
        </nav>
        <Language></Language>
      </section>
    </header>
  );
};

export default Header;
