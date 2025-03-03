import { View, Heading, ScrollView } from "@aws-amplify/ui-react";
import ClassTable from "./Class/ClassTable";

const dataClasses = [
  {
    id: 1,
    name: "aaa",
    start_time: "bbb",
    end_time: "wmowen0@weather.com",
    image: "https://i.pravatar.cc/50?img=1",
  },
  {
    id: 2,
    name: "aaa",
    start_time: "bbb",
    end_time: "wmowen0@weather.com",
    image: "https://i.pravatar.cc/50?img=1",
  },
  {
    id: 3,
    name: "aaa",
    start_time: "bbb",
    end_time: "wmowen0@weather.com",
    image: "https://i.pravatar.cc/50?img=1",
  },
  {
    id: 4,
    name: "aaa",
    start_time: "bbb",
    end_time: "wmowen0@weather.com",
    image: "https://i.pravatar.cc/50?img=1",
  },
  {
    id: 5,
    name: "aaa",
    start_time: "bbb",
    end_time: "wmowen0@weather.com",
    image: "https://i.pravatar.cc/50?img=1",
  },
];

const ClassTablesPage = () => {
  return (
    <>
      <View
        backgroundColor="var(--amplify-colors-white)"
        borderRadius="6px"
        maxWidth="100%"
        padding="1rem"
        minHeight="80vh"
      >
        <Heading color="#333"> Classes Manage </Heading>
        <br></br>
        <ScrollView width="100%">
          <ClassTable classes={dataClasses} />
        </ScrollView>
      </View>
    </>
  );
};

export default ClassTablesPage;
