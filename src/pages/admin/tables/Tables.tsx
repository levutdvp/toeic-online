import { View, Heading, ScrollView } from "@aws-amplify/ui-react";
import BasicTable from "./BasicTable";

const Tables = () => {
  return (
    <>
      <div>
        <h2>Tables</h2>
      </div>

      <View
        backgroundColor="var(--amplify-colors-white)"
        borderRadius="6px"
        maxWidth="100%"
        padding="1rem"
        minHeight="80vh"
      >
        <Heading color="#333"> Basic Table </Heading>
        <br></br>
        <ScrollView width="100%">
          <BasicTable />
        </ScrollView>
      </View>
    </>
  );
};

export default Tables;
