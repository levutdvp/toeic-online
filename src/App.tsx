import { ThemeProvider } from "@aws-amplify/ui-react";
import AllRoutes from "./routes/AllRoutes";
import theme from "./pages/admin/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AllRoutes />
    </ThemeProvider>
  );
}

export default App;
