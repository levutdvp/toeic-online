import { TFormRules } from "@/types/form.type";

export interface IEditForm {
  name: string;
  email: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  address: string;
}

export const validateForm: TFormRules<IEditForm> = {
  name: [{ required: true, message: "Please input full name" }],
  dob: [{ required: true, message: "Please input date of birth" }],
  gender: [{ required: true, message: "Please select gender" }],
  phoneNumber: [{ required: true, message: "Please input phone number" }],
  email: [
    { required: true, message: "Please input email address" },
    { type: "email", message: "Please enter a valid email address" },
  ],
  address: [{ required: true, message: "Please input address" }],
};
