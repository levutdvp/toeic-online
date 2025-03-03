import { Icon } from "@aws-amplify/ui-react";
import { SiGoogleclassroom } from "react-icons/si";
import {
  MdDashboard,
  MdModeEditOutline,
  MdAccountBox,
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
    title: "Dashboard",
    to: "/admin",
  },
  {
    eventKey: "accounts",
    icon: <Icon as={MdAccountCircle} />,
    title: "Accounts",
    to: "/admin/all-users",
    children: [
      {
        eventKey: "users",
        title: "Users",
        to: "/admin/all-users",
      },
      {
        eventKey: "teachers",
        title: "Teacher",
        to: "/admin/users-teacher",
      },
      {
        eventKey: "students",
        title: "Student",
        to: "/admin/users-student",
      },
    ],
  },
  {
    eventKey: "class",
    icon: <Icon as={SiGoogleclassroom} />,
    title: "Class",
    to: "/admin/classes",
  },
  {
    eventKey: "forms",
    icon: <Icon as={MdModeEditOutline} />,
    title: "Forms",
    to: "/admin/forms",
    children: [
      {
        eventKey: "form-basic",
        title: "Basic",
        to: "/admin/forms",
      },
      {
        eventKey: "form-wizard",
        title: "Edit Form",
        to: "/admin/edit-form",
      },
    ],
  },
  {
    eventKey: "profile",
    icon: <Icon as={MdAccountBox} />,
    title: "Profile",
    to: "/admin/profile",
  },
];
