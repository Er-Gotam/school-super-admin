import { useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Add, Edit, Refresh, Search, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useChangeSchoolStatus, useCreateSchool, useSchools, useUpdateSchool } from "../../hooks/useSchools";
import type { CreateSchoolRequest, School, UpdateSchoolRequest } from "../../types/school";
import { SchoolForm } from "./SchoolForm";

export function SchoolsPage() {
  const navigate = useNavigate();
  const { data: schools = [], isLoading, isError, error, refetch, isFetching } = useSchools();
  const create = useCreateSchool(); const update = useUpdateSchool(); const status = useChangeSchoolStatus();
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState<"ALL"|"ACTIVE"|"SUSPENDED">("ALL");
  const [formOpen, setFormOpen] = useState(false); const [editing, setEditing] = useState<School>();
  const [confirm, setConfirm] = useState<School>();

  const filtered = useMemo(() => schools.filter(s => {
    const matchesText = [s.name, s.phone, s.address].join(" ").toLowerCase().includes(search.toLowerCase());
    return matchesText && (filter === "ALL" || s.status === filter);
  }), [schools, search, filter]);

  function submit(data: CreateSchoolRequest | UpdateSchoolRequest) {
    if (editing) update.mutate({ id: editing.id, request: data as UpdateSchoolRequest }, { onSuccess: () => { setFormOpen(false); setEditing(undefined); } });
    else create.mutate(data as CreateSchoolRequest, { onSuccess: () => setFormOpen(false) });
  }
  const mutationError = (create.error ?? update.error) as any;

  return <Box sx={{ p:{xs:2,md:4}, maxWidth:1440, mx:"auto" }}>
    <Stack direction={{xs:"column",sm:"row"}} justifyContent="space-between" gap={2} mb={3}>
      <Box><Typography variant="h4" fontWeight={800}>Schools</Typography><Typography color="text.secondary">Manage schools across the platform</Typography></Box>
      <Button variant="contained" startIcon={<Add />} onClick={() => { setEditing(undefined); setFormOpen(true); }}>Create School</Button>
    </Stack>
    <Card><CardContent>
      <Stack direction={{xs:"column",md:"row"}} spacing={2} mb={2}>
        <TextField fullWidth placeholder="Search by name, phone or address" value={search} onChange={e => setSearch(e.target.value)} InputProps={{ startAdornment:<InputAdornment position="start"><Search /></InputAdornment> }} />
        <TextField select label="Status" value={filter} onChange={e => setFilter(e.target.value as typeof filter)} sx={{minWidth:180}}><MenuItem value="ALL">All</MenuItem><MenuItem value="ACTIVE">Active</MenuItem><MenuItem value="SUSPENDED">Suspended</MenuItem></TextField>
        <Tooltip title="Refresh"><IconButton onClick={() => refetch()}><Refresh /></IconButton></Tooltip>
      </Stack>
      {isLoading && <Box sx={{py:8,textAlign:"center"}}><CircularProgress /></Box>}
      {isError && <Alert severity="error" action={<Button size="small" onClick={() => refetch()}>Retry</Button>}>{(error as Error).message || "Unable to load schools."}</Alert>}
      {!isLoading && !isError && <Stack divider={<Divider />}>
        {filtered.length === 0 && <Typography color="text.secondary" sx={{py:5,textAlign:"center"}}>{schools.length ? "No schools match your filters." : "No schools found."}</Typography>}
        {filtered.map(s => <Stack key={s.id} direction={{xs:"column",sm:"row"}} alignItems={{sm:"center"}} justifyContent="space-between" gap={2} py={2}>
          <Box sx={{minWidth:0}}><Typography fontWeight={700}>{s.name}</Typography><Typography variant="body2" color="text.secondary">{s.phone} · {s.address || "No address"}</Typography></Box>
          <Stack direction="row" alignItems="center" spacing={1}><Chip size="small" label={s.status} color={s.status === "ACTIVE" ? "success" : "warning"} />
            <Tooltip title="Details"><IconButton onClick={() => navigate(`/schools/${s.id}`)}><Visibility /></IconButton></Tooltip>
            <Tooltip title="Edit"><IconButton onClick={() => { setEditing(s); setFormOpen(true); }}><Edit /></IconButton></Tooltip>
            <Button size="small" color={s.status === "ACTIVE" ? "warning" : "success"} onClick={() => setConfirm(s)}>{s.status === "ACTIVE" ? "Suspend" : "Activate"}</Button>
          </Stack>
        </Stack>)}
      </Stack>}
      {isFetching && !isLoading && <LinearRefresh />}
    </CardContent></Card>
    <SchoolForm open={formOpen} school={editing} loading={create.isPending || update.isPending} error={mutationError?.response?.data?.message} onClose={() => {setFormOpen(false);setEditing(undefined);}} onSubmit={submit} />
    <Dialog open={Boolean(confirm)} onClose={() => setConfirm(undefined)}><DialogTitle>{confirm?.status === "ACTIVE" ? "Suspend school?" : "Activate school?"}</DialogTitle><DialogContent>Are you sure you want to {confirm?.status === "ACTIVE" ? "suspend" : "activate"} <b>{confirm?.name}</b>?</DialogContent><DialogActions><Button onClick={() => setConfirm(undefined)}>Cancel</Button><Button variant="contained" color={confirm?.status === "ACTIVE" ? "warning" : "success"} disabled={status.isPending} onClick={() => confirm && status.mutate({id:confirm.id,status:confirm.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"},{onSuccess:()=>setConfirm(undefined)})}>Confirm</Button></DialogActions></Dialog>
  </Box>;
}
function LinearRefresh() { return <Box sx={{position:"fixed",top:0,left:0,right:0,zIndex:1300}}><Box sx={{height:2,bgcolor:"primary.main"}} /></Box>; }