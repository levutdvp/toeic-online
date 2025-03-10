import { TFormRules } from "@/types/form.type";

export interface IAddForm {
  class_code: string;
  class_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days: string;
  number_of_students: number;
  teacher: string;
}

export const validateForm: TFormRules<IAddForm> = {
  class_code: [{ required: true, message: "Please input user name" }],
  class_type: [
    { required: true, message: "Please input email address" },
    { type: "email", message: "Please enter a valid email address" },
  ],
};
