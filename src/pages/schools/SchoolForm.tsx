import { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import type { CreateSchoolRequest, School, UpdateSchoolRequest } from "../../types/school";

interface Props { open: boolean; school?: School; loading?: boolean; error?: string; onClose: () => void; onSubmit: (data: CreateSchoolRequest | UpdateSchoolRequest) => void; }

export function SchoolForm({ open, school, loading, error, onClose, onSubmit }: Props) {
  const edit = Boolean(school);
  const [name, setName] = useState(school?.name ?? "");
  const [phone, setPhone] = useState(school?.phone ?? "");
  const [address, setAddress] = useState(school?.address ?? "");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (edit) onSubmit({ name: name.trim(), phone: phone.trim(), address: address.trim() });
    else onSubmit({ schoolName: name.trim(), schoolPhone: phone.trim(), schoolAddress: address.trim(), adminName: adminName.trim(), adminEmail: adminEmail.trim().toLowerCase(), adminPassword });
  }

  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <form onSubmit={submit}><DialogTitle>{edit ? "Edit School" : "Create School"}</DialogTitle>
      <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="School name" value={name} onChange={e => setName(e.target.value)} required fullWidth />
        <TextField label="School phone" value={phone} onChange={e => setPhone(e.target.value)} required fullWidth placeholder="10-digit mobile number" />
        <TextField label="Address" value={address} onChange={e => setAddress(e.target.value)} fullWidth multiline minRows={2} />
        {!edit && <>
          <TextField label="Initial admin name" value={adminName} onChange={e => setAdminName(e.target.value)} required fullWidth />
          <TextField label="Initial admin email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} type="email" required fullWidth />
          <TextField label="Initial admin password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} type="password" required fullWidth helperText="8+ chars with uppercase, lowercase, number and special character" />
        </>}
      </Stack></DialogContent>
      <DialogActions><Button onClick={onClose}>Cancel</Button><Button type="submit" variant="contained" disabled={loading}>{loading ? "Saving..." : edit ? "Save Changes" : "Create School"}</Button></DialogActions>
    </form>
  </Dialog>;
}