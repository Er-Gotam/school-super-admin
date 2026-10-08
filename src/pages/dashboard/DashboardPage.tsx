import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("super_admin_token");
    navigate("/login", { replace: true });
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>School Super Admin</Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
        <Typography color="text.secondary" mt={1}>
          Super Admin foundation is ready. Platform metrics will be connected next.
        </Typography>
      </Box>
    </Box>
  );
}