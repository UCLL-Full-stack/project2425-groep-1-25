import { Event } from "@/types";

const getAllEvents = async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/events", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

const addEvent = async (event: Event) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
};

const getEventById = async (id: number) => {
  const user = sessionStorage.getItem("loggedInUser");
  const token = user ? JSON.parse(user).token : null;
  const result = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/events/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!result.ok) {
    throw new Error("Failed to fetch event");
  }
  return result.json();
};

export default { getAllEvents, addEvent, getEventById };
