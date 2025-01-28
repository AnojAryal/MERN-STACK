import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { AxiosError } from "axios";
import apiClient from "../services/apiClient";
import { useAuth } from "../components/AuthContext";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullname: string;
    username: string;
    email: string;
  };
}

interface FormData {
  username: string;
  password: string;
}

interface UseLoginReturn {
  formErrors: Record<string, string>;
  authError: string | null;
  isLoading: boolean;
  login: (formData: FormData, navigate: NavigateFunction) => Promise<void>;
}

export const useLogin = (): UseLoginReturn => {
  const { login } = useAuth();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.username) errors.username = "Username is required.";
    if (!formData.password) errors.password = "Password is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (
    formData: FormData,
    navigate: NavigateFunction
  ) => {
    if (!validateForm(formData)) return;

    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await apiClient.post<LoginResponse>(
        "/jwt/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const { accessToken, refreshToken, user } = response.data;
        login(accessToken, refreshToken, user);
        navigate("/home");
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      const errorMessage =
        axiosError.response?.data?.detail ||
        "Invalid credentials. Please try again.";
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { formErrors, authError, isLoading, login: handleLogin };
};
