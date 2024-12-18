import { useEffect, useState } from "react";
import styles from "@/styles/Form.module.css";
import { Category, Profile, StatusMessage, User } from "@/types";
import CategoryService from "@/services/CategoryService";
import ProfileService from "@/services/ProfileService";
import { useRouter } from "next/router";
import useSWR from "swr";

const ProfileForm: React.FC = () => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  //Location
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState<number>(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  //category
  const [categoryName, setCategoryName] = useState("");

  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [ageError, setAgeError] = useState<string>("");
  //location
  const [streetError, setStreetError] = useState<string>("");
  const [numberError, setNumberError] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");
  const [countryError, setCountryError] = useState<string>("");

  useEffect(() => {
    const user = sessionStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  }, []);

  const fetchCategories = async () => {
    const categories = await CategoryService.getAllCategories();
    return categories;
  };

  const {
    data: categories,
    isLoading,
    error,
  } = useSWR("FetchCategories", fetchCategories);

  if (error) return <div>{error}</div>;
  if (isLoading) return <div>The page is loading</div>;

  const validate = (): boolean => {
    let result = true;
    if (firstName?.trim() === "") {
      setFirstNameError("First name is required.");
      result = false;
    }
    if (lastName?.trim() === "") {
      setLastNameError("Last name is required.");
      result = false;
    }
    if (!age) {
      setAgeError("Age is required.");
    } else if (age < 0 || age > 100) {
      setAgeError("Age must be between 1 and 100.");
      result = false;
    }
    if (street?.trim() === "") {
      setStreetError("Street is required.");
      result = false;
    }
    if (!number) {
      setNumberError("Number is required.");
      result = false;
    }
    if (city?.trim() === "") {
      setCityError("City is required.");
      result = false;
    }
    if (country?.trim() === "") {
      setCountryError("Country is required.");
      result = false;
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    console.log(categoryName);
    const profile: Profile = {
      firstName,
      lastName,
      age,
      category: categories.find(
        (category: Category) => category.name === categoryName
      ),
      location: { street, number, city, country },
    };
    const response = await ProfileService.completeProfile(profile);
    if (response) {
      setStatusMessages([
        {
          message: "Profile Completed, redirecting to homepage",
          type: "success",
        },
      ]);
      setTimeout(() => {
        router.push("/");
      }, 500);
    }
  };

  return (
    <main className={styles.main}>
      {loggedInUser ? (
        <main className={styles.main}>
          {statusMessages &&
            statusMessages.map((statusMessage) => (
              <p className={styles[statusMessage.type]}>
                {statusMessage.message}
              </p>
            ))}
          <h1>Complete your profile before you can return to the main page!</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.div}>
              {statusMessages && (
                <div>
                  {statusMessages.map(({ message, type }, index) => (
                    <p
                      key={index}
                      className={
                        type === "error" ? styles.error : styles.success
                      }
                    >
                      {message}
                    </p>
                  ))}
                </div>
              )}
              <label htmlFor="firstName" className={styles.label}>
                First name:
              </label>
              <input
                className={styles.input}
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {firstNameError && (
                <strong className={styles.error}>{firstNameError}</strong>
              )}
            </div>
            <div className={styles.div}>
              <label htmlFor="lastName" className={styles.label}>
                Last name:
              </label>
              <input
                className={styles.input}
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {lastNameError && (
                <strong className={styles.error}>{lastNameError}</strong>
              )}
            </div>
            <div className={styles.div}>
              <label htmlFor="age" className={styles.label}>
                Age:
              </label>
              <input
                className={styles.input}
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
              {ageError && <strong className={styles.error}>{ageError}</strong>}
            </div>
            <strong>Location:</strong>
            <div className={styles.div}>
              <label htmlFor="street" className={styles.label}>
                Street:
              </label>
              <input
                className={styles.input}
                type="text"
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
              {streetError && (
                <strong className={styles.error}>{streetError}</strong>
              )}
            </div>
            <div className={styles.div}>
              <label htmlFor="number" className={styles.label}>
                Number:
              </label>
              <input
                className={styles.input}
                type="number"
                id="number"
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
              />
              {numberError && (
                <strong className={styles.error}>{numberError}</strong>
              )}
            </div>
            <div className={styles.div}>
              <label htmlFor="city" className={styles.label}>
                City:
              </label>
              <input
                className={styles.input}
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {cityError && (
                <strong className={styles.error}>{cityError}</strong>
              )}
            </div>
            <div className={styles.div}>
              <label htmlFor="country" className={styles.label}>
                Country:
              </label>
              <input
                className={styles.input}
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              {cityError && (
                <strong className={styles.error}>{countryError}</strong>
              )}
            </div>
            <div className={styles.div}>
              <label htmlFor="categoryName" className={styles.label}>
                Preferred category:
              </label>
              <select
                id="categoryName"
                value={categoryName}
                className={styles.input}
                onChange={(e) => setCategoryName(e.target.value)}
              >
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className={styles.button}>
              Register
            </button>
          </form>
        </main>
      ) : (
        <strong className={styles.error}>Please log in first</strong>
      )}
    </main>
  );
};
export default ProfileForm;
