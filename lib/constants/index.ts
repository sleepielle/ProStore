import z from "zod";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "ProStore";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern e-commerce platform";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "https://localhost:3000";

export const signInDefaultValues = {
  email: "admin@example.com",
  password: "123456",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "123 Main St.",
  city: "AnyTown",
  postalCode: "12345",
  country: "USA",
};
