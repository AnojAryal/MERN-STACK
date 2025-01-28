import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

// Define the context type
export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  username: string;
  email: string;
  exp: number;
  iat: number;
  login: (token: string) => void;
  logout: () => void;
}

// Default context values
const defaultAuthContext: AuthContextType = {
  token: null,
  isAuthenticated: false,
  username: "",
  email: "",
  exp: 0,
  iat: 0,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

const base64UrlDecode = (str: string): string => {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  switch (base64.length % 4) {
    case 0:
      break;
    case 2:
      base64 += "==";
      break;
    case 3:
      base64 += "=";
      break;
    default:
      throw new Error("Invalid Base64 string.");
  }

  return atob(base64);
};

const decodeToken = (token: string | null): AuthContextType | null => {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64String = base64UrlDecode(base64Url);
    const decodedPayload = JSON.parse(base64String) as {
      username: string;
      email: string;
      exp: number;
      iat: number;
    };

    if (decodedPayload.exp * 1000 < Date.now()) {
      console.warn("Token has expired.");
      return null;
    }

    return {
      username: decodedPayload.username,
      email: decodedPayload.email,
      exp: decodedPayload.exp,
      iat: decodedPayload.iat,
      token,
      isAuthenticated: true,
      login: () => {},
      logout: () => {},
    };
  } catch (error) {
    console.error("Token decoding error:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] =
    useState<AuthContextType>(defaultAuthContext);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const decodedToken = decodeToken(token || "");

    if (decodedToken) {
      setAuthState(decodedToken);
    }

    console.log("isAuthenticated:", decodedToken?.isAuthenticated ?? false);
  }, []);

  const login = (token: string) => {
    const decodedToken = decodeToken(token);

    if (decodedToken) {
      setAuthState(decodedToken);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthState(defaultAuthContext);
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
