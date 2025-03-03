import { View, Heading, ScrollView } from "@aws-amplify/ui-react";
import TeachersTable from "./TeacherTable/TeachersTable";

const TeachersTablePage = () => {
  return (
    <>
      <View
        backgroundColor="var(--amplify-colors-white)"
        borderRadius="6px"
        maxWidth="100%"
        padding="1rem"
        minHeight="80vh"
      >
        <Heading color="#333"> Teachers Manage </Heading>
        <br></br>
        <ScrollView width="100%">
          <TeachersTable />
        </ScrollView>
      </View>
    </>
  );
};

export default TeachersTablePage;
