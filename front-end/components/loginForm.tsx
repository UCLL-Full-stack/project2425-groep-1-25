import UserService from "@/services/UserService";
import { useState } from "react";
import { StatusMessage } from "@/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "@/styles/Form.module.css";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

  const clearErrors = () => {
    setNameError("");
    setPasswordError("");
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = true;

    if (name?.trim() === "") {
      setNameError(t("login.validate.name"));
      result = false;
    }
    if (password?.trim() === "") {
      setPasswordError(t("login.validate.password"));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    clearErrors();

    if (!validate()) {
      return;
    }
    const user = { userName: name, password };
    const response = await UserService.loginUser(user);

    if (response.status === 200) {
      setStatusMessages([{ message: t("login.success"), type: "success" }]);

      const user = await response.json();
      sessionStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          token: user.token,
          userName: user.userName,
          role: user.role,
        })
      );
      router.push("/events");
    } else if (response.status === 401) {
      const { errorMessage } = await response.json();
      setStatusMessages([{ message: errorMessage, type: "error" }]);
    } else {
      setStatusMessages([
        {
          message: t("general.error"),
          type: "error",
        },
      ]);
    }
  };

  return (
    <>
      {statusMessages.map((message, index) => (
        <div key={index} className={message.type}>
          {message.message}
        </div>
      ))}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label className={styles.label} htmlFor="name">
            {t("login.label.username")}
          </label>
          <input
            className={styles.input}
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>{nameError}</div>
        </div>
        <div>
          <label className={styles.label} htmlFor="password">
            {t("login.label.password")}
          </label>
          <input
            className={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>{passwordError}</div>
        </div>
        <button type="submit" className={styles.button}>
          {t("login.button")}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
