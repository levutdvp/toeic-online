import React, { createContext, useReducer, useContext, ReactNode } from "react";

interface User {
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthAction {
  type: "LOGIN" | "LOGOUT";
  payload?: User;
}
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload || null, isAuthenticated: true };
    case "LOGOUT":
      return { user: null, isAuthenticated: false };
    default:
      return state;
  }
};

interface AuthContextProps {
  state: AuthState;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
  });

  const login = (username: string, password: string) => {
    if (username && password) {
      dispatch({ type: "LOGIN", payload: { username } });
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth, authReducer };
