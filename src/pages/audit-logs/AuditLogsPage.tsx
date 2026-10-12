import { useMemo, useState } from "react";
import { Alert, AppBar, Box, Button, Chip, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuditLogs } from "../../hooks/useAuditLogs";
import type { AuditLog } from "../../types/auditLog";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const formatDate = (value: string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date); };
const actionColor = (action: string): "success" | "warning" | "error" | "info" | "default" => {
  if (action.includes("SUSPENDED") || action.includes("DEACTIVATED") || action.includes("EXPIRED")) return "warning";
  if (action.includes("CREATED") || action.includes("ACTIVATED") || action.includes("ASSIGNED") || action.includes("RENEWED")) return "success";
  if (action.includes("UPDATED")) return "info";
  return "default";
};

export function AuditLogsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const { data, isLoading, isError, error, refetch, isFetching } = useAuditLogs(page, size);
  const actions = useMemo(() => [...new Set((data?.content ?? []).map((log) => log.action))].sort(), [data?.content]);
  const rows = useMemo(() => (data?.content ?? []).filter((log) => {
    const term = search.trim().toLowerCase();
    const matches = !term || [log.actorName, log.actorEmail, log.schoolName, log.action, log.targetType, log.targetId, log.details].some((value) => value?.toLowerCase().includes(term));
    return matches && (actionFilter === "ALL" || log.action === actionFilter);
  }), [data?.content, search, actionFilter]);

  return <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
    <AppBar position="sticky" elevation={0}><Toolbar>
      <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>School Super Admin</Typography>
      <Button color="inherit" onClick={() => navigate("/")}>Dashboard</Button>
      <Button color="inherit" onClick={() => { localStorage.removeItem("super_admin_token"); navigate("/login", { replace: true }); }}>Logout</Button>
    </Toolbar></AppBar>
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: "auto" }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={2} mb={3}>
        <Box><Typography variant="h4" fontWeight={800}>Audit Logs</Typography><Typography color="text.secondary">Review important platform and subscription activity.</Typography></Box>
        <Button variant="outlined" onClick={() => refetch()} disabled={isFetching}>Refresh logs</Button>
      </Stack>
      <Paper sx={{ p: 2, mb: 2 }}><Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField fullWidth size="small" label="Search current page" placeholder="Actor, school, action or details" value={search} onChange={(e) => setSearch(e.target.value)} />
        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 250 } }}><InputLabel id="audit-action-label">Action</InputLabel>
          <Select labelId="audit-action-label" label="Action" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
            <MenuItem value="ALL">All actions</MenuItem>{actions.map((action) => <MenuItem key={action} value={action}>{action.replaceAll("_", " ")}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack></Paper>
      {isError && <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" size="small" onClick={() => refetch()}>Retry</Button>}>{(error as Error)?.message || "Unable to load audit logs."}</Alert>}
      {isLoading ? <Box sx={{ py: 10, textAlign: "center" }}><CircularProgress /><Typography mt={2} color="text.secondary">Loading audit logs...</Typography></Box> :
        <TableContainer component={Paper}><Table size="small">
          <TableHead><TableRow><TableCell>Timestamp</TableCell><TableCell>Action</TableCell><TableCell>Actor</TableCell><TableCell>School</TableCell><TableCell>Target</TableCell><TableCell>Details</TableCell></TableRow></TableHead>
          <TableBody>
            {rows.map((log: AuditLog) => <TableRow key={log.id} hover>
              <TableCell sx={{ minWidth: 165, whiteSpace: "nowrap" }}>{formatDate(log.createdAt)}</TableCell>
              <TableCell sx={{ minWidth: 190 }}><Chip size="small" color={actionColor(log.action)} label={log.action.replaceAll("_", " ")} /></TableCell>
              <TableCell sx={{ minWidth: 180 }}><Typography variant="body2" fontWeight={600}>{log.actorName || "System"}</Typography><Typography variant="caption" color="text.secondary">{log.actorEmail || "—"}</Typography></TableCell>
              <TableCell sx={{ minWidth: 160 }}>{log.schoolName || "Platform"}</TableCell>
              <TableCell sx={{ minWidth: 140 }}>{[log.targetType, log.targetId].filter(Boolean).join(" · ") || "—"}</TableCell>
              <TableCell sx={{ minWidth: 220, maxWidth: 360, whiteSpace: "normal", overflowWrap: "anywhere" }}>{log.details || "—"}</TableCell>
            </TableRow>)}
            {rows.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>{data?.content.length ? "No logs match these filters." : "No audit logs found."}</TableCell></TableRow>}
          </TableBody>
        </Table><TablePagination component="div" count={data?.totalElements ?? 0} page={page} onPageChange={(_, next) => setPage(next)} rowsPerPage={size} onRowsPerPageChange={(e) => { setSize(Number(e.target.value)); setPage(0); }} rowsPerPageOptions={[10, 20, 50]} /></TableContainer>}
      <Typography variant="caption" color="text.secondary" display="block" mt={1}>Search and action filters apply to the currently loaded page. Logs are ordered newest first.</Typography>
    </Box>
  </Box>;
}
