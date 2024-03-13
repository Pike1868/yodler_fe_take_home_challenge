import React, { useState } from "react";
import {
  Avatar,
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  Toolbar
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ServerAPI from "../api/ServerAPI";
import { jwtDecode } from "jwt-decode";
import { useUserContext } from "../context/user";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { setUser } = useUserContext();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formFieldNames = {
    email: "Email Address",
    password: "Password",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let user = {
      email: data.get("email"),
      password: data.get("password"),
    };

    //Check for empty fields
    for (let key in user) {
      if (user[key].trim() === "") {
        setError(`Please enter your ${formFieldNames[key]}.`);
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    //Check password length
    if (user.password.length < 5) {
      setError("Password must be at least 5 characters long.");
      return;
    }

    try {
      console.log("Data to submit:", user);
      const token = await ServerAPI.login(user);
      const decoded = jwtDecode(token);
      if (decoded) {
        setUser({
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          isAdmin: decoded.isAdmin,
        });
      }
      navigate("/");
    } catch (err) {
      let msg = err[0];
      setError(msg);
    }
  };

  return (
    <>
    <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate("/signup")}>Sign Up</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#253031", p: 2 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="flex-end"></Grid>
        </Box>
      </Box>
    </Container>
    </>
    
  );
}
