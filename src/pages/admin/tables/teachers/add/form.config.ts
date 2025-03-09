import { TFormRules } from "@/types/form.type";

export interface IAddForm {
  fullName: string;
  email: string;
}

export const validateForm: TFormRules<IAddForm> = {
  fullName: [{ required: true, message: 'Please input user name' }],
  email: [
    { required: true, message: 'Please input email address' },
    { type: 'email', message: 'Please enter a valid email address' },
  ],
};
