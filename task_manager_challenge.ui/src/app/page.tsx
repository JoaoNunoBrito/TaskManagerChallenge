"use client"

import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import TasksPage from "./task/page";
import { CircularProgress, styled } from "@mui/material";

const HomePage = () => {
  const router = useRouter();
  const { user, isLoading } = useAuthContext();

  // Redirect logic: If the user is not authenticated, show the login page
  // If the user is not authenticated, the login page should be shown automatically

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("Redirecting to login because user is: ", user);
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <CenteredContainer>
        <CircularProgress />
      </CenteredContainer>
    );
  }
  
  if (user) {
    return (
      <TasksPage />
    );
  }

  return null;
};

const CenteredContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

export default HomePage;
