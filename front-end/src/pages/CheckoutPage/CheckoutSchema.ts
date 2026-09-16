import * as yup from "yup";

export const checkoutSchema = yup.object({
  name: yup
    .string()
    .required("Full name is required")
    .trim()
    .min(2, "Full name must be at least 2 characters"),

  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .trim(),

  city: yup.string().required("Province/City is required").trim(),

  phone: yup
    .string()
    .matches(/^(0|\+84)\d{9,10}$/, "Invalid phone number")
    .required("Phone number is required")
    .trim(),

  address: yup
    .string()
    .min(8, "Address must be at least 8 characters")
    .required("Address is required")
    .trim(),

  deliveryDate: yup.string().required("Delivery date is required"),

  note: yup.string().trim(),
});
