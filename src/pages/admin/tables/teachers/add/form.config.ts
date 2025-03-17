import { TFormRules } from "@/types/form.type";
export interface IAddForm {
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  certificates: string[];
}

export const validateForm: TFormRules<IAddForm> = {
  name: [{ required: true, message: "Please input full name" }],
  dob: [{ required: true, message: "Please input date of birth" }],
  gender: [{ required: true, message: "Please select gender" }],
  phone: [{ required: true, message: "Please input phone number" }],
  email: [
    { required: true, message: "Please input email address" },
    { type: "email", message: "Please enter a valid email address" },
  ],
  address: [{ required: true, message: "Please input address" }],
  certificates: [
    { required: true, message: "Please input at least one certificate" },
  ],
};
