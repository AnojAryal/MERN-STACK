import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/apiClient";

export interface Workout {
  _id: string;
  title: string;
  reps: number;
  load: number;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export const useWorkouts = () => {
  const fetchWorkouts = async (): Promise<Workout[]> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient.get<Workout[]>("/api/workouts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const { data: workouts, error, isLoading, refetch } = useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });

  return { workouts, error, isLoading, refetch };
};
