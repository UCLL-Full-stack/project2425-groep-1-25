import { Event } from "@/types";
import { useState } from "react";
import styles from "@/styles/Form.module.css";
import EventService from "@/services/EventService";
import { useRouter } from "next/router";

type Prop = {
  event: Event;
};
const EditEventForm: React.FC<Prop> = ({ event }: Prop) => {
  const router = useRouter();
  const [name, setName] = useState(event.name);
  const [street, setStreet] = useState(event.location.street);
  const [number, setNumber] = useState(event.location.number);
  const [city, setCity] = useState(event.location.city);
  const [country, setCountry] = useState(event.location.country);
  const [date, setDate] = useState(new Date(event.date));
  const [minParticipants, setMinParticipants] = useState(event.minParticipants);
  const [maxParticipants, setMaxParticipants] = useState(event.maxParticipants);
  const [price, setPrice] = useState(event.price);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categoryName, setCategoryName] = useState(event.category.name);
  const [categoryDescription, setCategoryDescription] = useState(
    event.category.description
  );
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "Name is required";
    if (!street) newErrors.street = "Street is required";
    if (!number) newErrors.number = "Number is required";
    if (!city) newErrors.city = "City is required";
    if (!country) newErrors.country = "Country is required";
    if (!date) newErrors.date = "Date is required";
    if (!categoryDescription)
      newErrors.categoryDescription = "Description is required";
    if (!categoryName) newErrors.categoryName = "Name is required";

    if (minParticipants <= 0)
      newErrors.minParticipants = "Min Participants must be greater than 0";
    if (maxParticipants <= 0)
      newErrors.maxParticipants = "Max Participants must be greater than 0";
    if (minParticipants > maxParticipants) {
      newErrors.minParticipants =
        "Min participants must be smaller than max participants";
    }
    if (price < 0) newErrors.price = "Price cannot be negative";
    return newErrors;
  };

  const handleDelete = async () => {
    if (event.id) EventService.deleteEvent(event.id);

    setTimeout(() => {
      router.push("/events");
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const changedEvent: Event = {
        id: event.id,
        name,
        date,
        price,
        maxParticipants,
        minParticipants,
        location: { id: event.location.id, street, number, city, country },
        category: {
          id: event.category.id,
          name: categoryName,
          description: categoryDescription,
        },
      };
      if (event.id) {
        const result = await EventService.editEvent(event.id, changedEvent);
        if (result.ok) {
          setTimeout(() => {
            router.push("/events");
          }, 500);
        } else {
        }
      }
    }
  };

  return (
    <>
      <form className="d-flex flex-column flex-gap-2" onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className={styles.error}>{errors.name}</p>}

        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          className={styles.input}
          value={date.toISOString().split("T")[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
        {errors.date && <p className={styles.error}>{errors.date}</p>}

        <label htmlFor="minParticipants">Min Participants:</label>
        <input
          id="minParticipants"
          type="number"
          className={styles.input}
          value={minParticipants}
          onChange={(e) => setMinParticipants(Number(e.target.value))}
        />
        {errors.minParticipants && (
          <p className={styles.error}>{errors.minParticipants}</p>
        )}

        <label htmlFor="maxParticipants">Max Participants:</label>
        <input
          id="maxParticipants"
          type="number"
          className={styles.input}
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(Number(e.target.value))}
        />
        {errors.maxParticipants && (
          <p className={styles.error}>{errors.maxParticipants}</p>
        )}

        <label htmlFor="price">Price:</label>
        <input
          id="price"
          type="number"
          className={styles.input}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        {errors.price && <p className={styles.error}>{errors.price}</p>}

        <p className="mt-2 mb-0">
          <strong>Location</strong>
        </p>
        <div>
          <label htmlFor="streetInput" className="m-1">
            Street
          </label>
          <input
            type="text"
            id="streetInput"
            className={styles.input}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          {errors.street && <p className={styles.error}>{errors.street}</p>}

          <label htmlFor="numberInput" className="m-1">
            Number
          </label>
          <input
            type="number"
            id="numberInput"
            className={styles.input}
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
            min={1}
          />
          {errors.number && <p className={styles.error}>{errors.number}</p>}

          <label htmlFor="cityInput">City</label>
          <input
            type="text"
            id="cityInput"
            className={styles.input}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {errors.city && <p className={styles.error}>{errors.city}</p>}

          <label htmlFor="countryInput">Country</label>
          <input
            type="text"
            id="countryInput"
            className={styles.input}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {errors.country && <p className={styles.error}>{errors.country}</p>}
        </div>
        <p className="mt-2 mb-0">
          <strong>Category</strong>
        </p>
        <div>
          <label htmlFor="categoryName" className="m-1">
            Name:
          </label>
          <input
            type="text"
            id="categoryName"
            className={styles.input}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          {errors.categoryName && (
            <p className={styles.error}>{errors.categoryName}</p>
          )}

          <label htmlFor="categoryDescription" className="m-1">
            Description:
          </label>
          <input
            type="text"
            id="categoryDescription"
            className={styles.input}
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            min={1}
          />
          {errors.categoryDescription && (
            <p className={styles.error}>{errors.categoryDescription}</p>
          )}
        </div>
        <p>
          <button type="submit" className={styles.button}>
            Save
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
          >
            Delete
          </button>
        </p>
      </form>
    </>
  );
};

export default EditEventForm;
