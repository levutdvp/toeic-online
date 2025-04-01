import { Icon } from "@aws-amplify/ui-react";
import { SiGoogleclassroom } from "react-icons/si";
import {
  MdDashboard,
  MdModeEditOutline,
  MdAccountCircle,
} from "react-icons/md";
import { useAuth } from "@/hooks/use-auth.hook";
import { showToast } from "@/services/toast";

export const baseConfig = {
  titleSuffix: "",
  search: true,
  header: true,
  headerText: "Logo",
  footer: true,
};

export const useAppNavs = () => {
  const { userRoles } = useAuth();

  const handleRestrictedAccess = () => {
    showToast({
      type: "error",
      content: "Bạn không có quyền truy cập trang này",
    });
  };

  return [
    {
      eventKey: "dashboard",
      icon: <Icon as={MdDashboard} />,
      title: "Báo cáo",
      to: "/admin",
    },
    {
      eventKey: "accounts",
      icon: <Icon as={MdAccountCircle} />,
      title: "Quản lí",
      to: userRoles.includes("TEACHER") ? "#" : "/admin/all-users",
      onClick: userRoles.includes("TEACHER")
        ? handleRestrictedAccess
        : undefined,
      children: userRoles.includes("TEACHER")
        ? [
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
          ]
        : [
            {
              eventKey: "users",
              title: "Quản lí tài khoản",
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
      eventKey: "exams",
      icon: <Icon as={MdModeEditOutline} />,
      title: "Quản lí đề thi",
      to: "/admin/exams",
      children: [
        { eventKey: "part1", title: "Part 1", to: "/admin/exams/part1" },
        { eventKey: "part2", title: "Part 2", to: "/admin/exams/part2" },
        { eventKey: "part3", title: "Part 3", to: "/admin/exams/part3" },
        { eventKey: "part4", title: "Part 4", to: "/admin/exams/part4" },
        { eventKey: "part5", title: "Part 5", to: "/admin/exams/part5" },
        { eventKey: "part6", title: "Part 6", to: "/admin/exams/part6" },
        { eventKey: "part7", title: "Part 7", to: "/admin/exams/part7" },
      ],
    },
  ];
};
