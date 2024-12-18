const getAllCategories = async () => {
  const user = sessionStorage.getItem("loggedInUser");
  const token = user ? JSON.parse(user).token : null;
  const result = await fetch(process.env.NEXT_PUBLIC_API_URL + "/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!result.ok) {
    throw new Error("Failed to fetch categories.");
  }
  return result.json();
};
export default { getAllCategories };
