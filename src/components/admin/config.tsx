import { Icon } from "@aws-amplify/ui-react";
import { SiGoogleclassroom } from "react-icons/si";
import {
  MdDashboard,
  MdModeEditOutline,
  MdAccountCircle,
} from "react-icons/md";

export const baseConfig = {
  titleSuffix: "",
  search: true,
  header: true,
  headerText: "Logo",
  footer: true,
};

export const appNavs = [
  {
    eventKey: "dashboard",
    icon: <Icon as={MdDashboard} />,
    title: "Thống kê",
    to: "/admin",
  },
  {
    eventKey: "accounts",
    icon: <Icon as={MdAccountCircle} />,
    title: "Quản lí",
    to: "/admin/all-users",
    children: [
      {
        eventKey: "users",
        title: "Quản lí người dùng",
        to: "/admin/all-users",
      },
      {
        eventKey: "teachers",
        title: "Quản lí giáo viên",
        to: "/admin/users-teacher",
      },
      {
        eventKey: "students",
        title: "Quản lí học sinh",
        to: "/admin/users-student",
      },
    ],
  },
  {
    eventKey: "class",
    icon: <Icon as={SiGoogleclassroom} />,
    title: "Quản lí lớp học",
    to: "/admin/classes",
  },
  {
    eventKey: "editForms",
    icon: <Icon as={MdModeEditOutline} />,
    title: "Quản lí đề thi",
    to: "/admin/edit-form",
  },
];
