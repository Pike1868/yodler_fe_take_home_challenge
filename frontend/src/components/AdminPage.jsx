import React, { useEffect, useState } from "react";
import ServerAPI from "../api/ServerAPI";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography } from "@mui/material";
import { useUserContext } from "../context/user";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await ServerAPI.getAllUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          <Button color="inherit" onClick={() => {
            localStorage.removeItem("ServerToken"); 
            setUser(null);// Clear user token
            navigate("/signin"); // Navigate to signin or signup page
          }}>Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Container>
    </>
  );
};

export default AdminPage;

