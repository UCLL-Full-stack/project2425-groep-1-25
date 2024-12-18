import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/header";
import { useRouter } from "next/router";

window.React = React;

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: any) => key })
}));

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

const user = {
  id: 1,
  userName: "User1",
  email: "User1@gmail.com",
  role: "User",
  password: "password",
  profile: {
    id: 1,
    firstName: "First",
    lastName: "Last",
    age: 25,
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
    events: []
  }
};

beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
});

test("given a user, when the user is logged in, then the username should be displayed", () => {
    //when 
    render(<Header />);

    //then
    expect(screen.getByText(`${user.userName}`));
});