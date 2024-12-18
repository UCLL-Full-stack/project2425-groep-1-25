import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import EventOverview from "@/components/events/EventOverview";
import { useRouter } from "next/router";

window.React = React;

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key: any) => key})

}));

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));



const events = [
    {
      id: 1,
      name: "Event 1",
      date: new Date("2023-12-01"),
      price: 50,
      minParticipants: 10,
      maxParticipants: 100,
      location: {
        id: 1,
        street: "Main Street",
        number: 123,
        city: "City A",
        country: "Country A"
      },
      category: {
        id: 1,
        name: "Category 1",
        description: "Description for Category 1"
      },
      lastEdit: new Date("2023-11-01"),
      dateCreated: new Date("2023-10-01")
    },
    {
      id: 2,
      name: "Event 2",
      date: new Date("2023-12-15"),
      price: 75,
      minParticipants: 20,
      maxParticipants: 150,
      location: {
        id: 2,
        street: "Second Street",
        number: 456,
        city: "City B",
        country: "Country B"
      },
      category: {
        id: 2,
        name: "Category 2",
        description: "Description for Category 2"
      },
      lastEdit: new Date("2023-11-15"),
      dateCreated: new Date("2023-10-15")
    },
    {
      id: 3,
      name: "Event 3",
      date: new Date("2023-12-30"),
      price: 100,
      minParticipants: 30,
      maxParticipants: 200,
      location: {
        id: 3,
        street: "Third Street",
        number: 789,
        city: "City C",
        country: "Country C"
      },
      category: {
        id: 3,
        name: "Category 3",
        description: "Description for Category 3"
      },
      lastEdit: new Date("2023-11-30"),
      dateCreated: new Date("2023-10-30")
    }
  ];

test ('given events, when rendering EventOverview, then render all events', async () => {
    // when 
    await act(async () => {
        render(<EventOverview events={events} />);
      });
    // then
    expect(screen.findByText("Event 1"))
    expect(screen.findByText("Event 2"))
    expect(screen.findByText("Event 3"))
});

