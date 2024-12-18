import { Event } from "@/types";

const getAllEvents = async () => {
  const user = sessionStorage.getItem("loggedInUser");
  const token = user ? JSON.parse(user).token : null;
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

const addEvent = async (event: Event) => {
  const user = sessionStorage.getItem("loggedInUser");
  const token = user ? JSON.parse(user).token : null;
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  });
};

const editEvent = async (id: number, event: Event) => {
  const user = sessionStorage.getItem("loggedInUser");
  const token = user ? JSON.parse(user).token : null;
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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

const joinEvent = async (eventId: number) => {
  const user = sessionStorage.getItem("loggedInUser");
  const token = user ? JSON.parse(user).token : null;
  const userName = user ? JSON.parse(user).userName : null;

  if (!token || !userName) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userName }),
    }
  );

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to join event: ${errorMessage}`);
  }

  return response.json();
};

const getEventParticipants = async (eventId: number) => {
  const user = sessionStorage.getItem("loggedInUser");
  const token = user ? JSON.parse(user).token : null;
  const result = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/events/${eventId}/participants`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!result.ok) {
    throw new Error("Failed to get participants");
  }
  return result.json();
};

const getEventsByParticipant = async () => {
  const user = sessionStorage.getItem("loggedInUser");
  const token = user ? JSON.parse(user).token : null;
  const userName = user ? JSON.parse(user).userName : null;
  const result = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/events/${userName}/joined`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!result.ok) {
    throw new Error("Failed to fetch events");
  }
  return result.json();
};

const deleteEvent = async (id: number) => {
  const user = sessionStorage.getItem("loggedInUser");
  const token = user ? JSON.parse(user).token : null;
  const result = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/events/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!result.ok) {
    throw new Error("Unable to delete event.");
  }
  return result.json();
};

export default {
  getAllEvents,
  addEvent,
  editEvent,
  getEventById,
  joinEvent,
  deleteEvent,
  getEventParticipants,
  getEventsByParticipant,
};
