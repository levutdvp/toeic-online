import { ThemeProvider } from "@aws-amplify/ui-react";
import AllRoutes from "./routes/AllRoutes";
import theme from "./pages/admin/theme";
import "@aws-amplify/ui-react/styles.css";
import { ToastContainer } from "./services/toast";
import { Loading } from "./services/loading";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AllRoutes />
      <Loading/>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
