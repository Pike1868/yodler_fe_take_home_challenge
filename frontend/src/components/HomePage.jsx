import React from "react";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { useUserContext } from "../context/user";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear the user token from localStorage
    localStorage.removeItem("ServerToken");
    // Reset the user context
    setUser(null);
    // Redirect to sign-in or another public page
    navigate("/signin");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Yodlr
          </Typography>
          {user && user.isAdmin && (
            <Button color="inherit" onClick={() => navigate("/admin")}>
              Admin
            </Button>
          )}
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md">
        <Box sx={{ mt: 8, mb: 4, textAlign: "center" }}>
          {" "}
          {/* Centered text */}
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome Back, {user.firstName}!
          </Typography>
          <Typography variant="h4">Explore what's new today.</Typography>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
