import { AuthProvider } from "./contexts/auth.context";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <AuthProvider>
      <AllRoutes />
    </AuthProvider>
  );
}

export default App;
