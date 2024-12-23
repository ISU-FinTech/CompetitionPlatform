import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../slices/auth";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

enum Roles {
  Competitor = "Competitor",
  Admin = "Admin",
}

interface UserInfo {
  username: string;
  email: string;
  password: string;
  role: Roles;
}

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    email: "",
    password: "",
    role: Roles.Competitor,
  });
  const [error, setError] = useState<string>("");
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/register",
        userInfo
      );

      const { email, username, role, id } = response.data.user;
      dispatch(login({ email, role, username, id }));
      navigate('/login');
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Invalid registration credentials");
      setOpenAlert(true);
    }
  };

  const handleLogin = async () => {
    navigate('/login')
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ marginTop: 4, maxWidth: 400, marginX: "auto" }}
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      <Collapse in={openAlert}>
        <Alert
          severity="error"
          onClose={() => setOpenAlert(false)}
          sx={{ marginBottom: 2 }}
        >
          {error}
        </Alert>
      </Collapse>

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={userInfo.email}
        onChange={(e) =>
          setUserInfo((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={userInfo.password}
        onChange={(e) =>
          setUserInfo((prev) => ({
            ...prev,
            password: e.target.value,
          }))
        }
      />
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={userInfo.username}
        onChange={(e) =>
          setUserInfo((prev) => ({
            ...prev,
            username: e.target.value,
          }))
        }
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          value={userInfo.role}
          onChange={(e) =>
            setUserInfo((prev) => ({
              ...prev,
              role: e.target.value as Roles,
            }))
          }
        >
          <MenuItem value={Roles.Competitor}>{Roles.Competitor}</MenuItem>
          <MenuItem value={Roles.Admin}>{Roles.Admin}</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={handleRegister}
      >
        Register
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={handleLogin}
      >
        Login
      </Button>
    </Box>
  );
}

export default RegisterPage;
