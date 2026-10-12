import { useState } from "react";
import { Alert, AppBar, Box, Button, Card, CardContent, CircularProgress, Divider, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { changePassword, getMe } from "../../api/auth";
import { useQuery } from "@tanstack/react-query";

export function ProfileSecurityPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["super-admin", "current-user"],
    queryFn: getMe,
    staleTime: 60_000,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess("");
    setFormError("");
    if (newPassword.length < 8) { setFormError("New password must contain at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setFormError("New password and confirmation do not match."); return; }
    if (currentPassword === newPassword) { setFormError("New password must be different from the current password."); return; }
    setSubmitting(true);
    try {
      const message = await changePassword({ currentPassword, newPassword });
      setSuccess(message || "Password changed successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setFormError(error.response?.data?.message || error.message || "Unable to change password.");
    } finally { setSubmitting(false); }
  }

  const logout = () => { localStorage.removeItem("super_admin_token"); navigate("/login", { replace: true }); };

  return <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
    <AppBar position="sticky" elevation={0}><Toolbar>
      <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>School Super Admin</Typography>
      <Button color="inherit" onClick={() => navigate("/")}>Dashboard</Button>
      <Button color="inherit" onClick={logout}>Logout</Button>
    </Toolbar></AppBar>
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" fontWeight={800}>Profile &amp; Security</Typography>
      <Typography color="text.secondary" mb={3}>View your account details and keep your account secure.</Typography>
      <Stack spacing={3}>
        <Card><CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Account Profile</Typography>
          {isLoading ? <CircularProgress size={24} /> : isError ? <Alert severity="error" action={<Button size="small" color="inherit" onClick={() => refetch()}>Retry</Button>}>{(error as Error)?.message || "Unable to load profile."}</Alert> : profile &&
            <Stack spacing={2}>
              <Box><Typography variant="caption" color="text.secondary">Full name</Typography><Typography fontWeight={600}>{profile.name || "—"}</Typography></Box>
              <Divider />
              <Box><Typography variant="caption" color="text.secondary">Email address</Typography><Typography fontWeight={600}>{profile.email || "—"}</Typography></Box>
              <Divider />
              <Box><Typography variant="caption" color="text.secondary">Role</Typography><Typography fontWeight={600}>{profile.role.replaceAll("_", " ")}</Typography></Box>
              <Divider />
              <Box><Typography variant="caption" color="text.secondary">Account scope</Typography><Typography fontWeight={600}>{profile.schoolName || "Platform-wide access"}</Typography></Box>
            </Stack>}
        </CardContent></Card>
        <Card><CardContent>
          <Typography variant="h6" fontWeight={700}>Change Password</Typography>
          <Typography color="text.secondary" variant="body2" mb={2}>Use your current password to set a new password of at least 8 characters.</Typography>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <Stack component="form" spacing={2} onSubmit={handleChangePassword} sx={{ maxWidth: 520 }}>
            <TextField label="Current password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" required fullWidth />
            <TextField label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" inputProps={{ minLength: 8 }} helperText="Minimum 8 characters" required fullWidth />
            <TextField label="Confirm new password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" error={Boolean(confirmPassword) && confirmPassword !== newPassword} helperText={confirmPassword && confirmPassword !== newPassword ? "Passwords do not match" : " "} required fullWidth />
            <Box><Button type="submit" variant="contained" disabled={submitting}>{submitting ? <CircularProgress size={22} color="inherit" /> : "Update password"}</Button></Box>
          </Stack>
        </CardContent></Card>
      </Stack>
    </Box>
  </Box>;
}
