import { Alert, AppBar, Box, Button, Card, CardContent, Chip, CircularProgress, Grid, LinearProgress, Stack, Toolbar, Typography } from "@mui/material";
import { Business, CheckCircle, People, School, CreditCard, Warning, Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";
import type { RecentSchool, RecentSubscription } from "../../types/dashboard";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const formatDate = (value: string) => dateFormatter.format(new Date(value));

function StatCard({ title, value, icon, subtitle }: { title: string; value: number; icon: React.ReactNode; subtitle?: string }) {
  return <Card sx={{ height: "100%" }}><CardContent>
    <Stack direction="row" justifyContent="space-between" mb={2}><Typography color="text.secondary" variant="body2">{title}</Typography>
      <Box sx={{ display:"grid", placeItems:"center", width:40, height:40, borderRadius:2, bgcolor:"primary.50", color:"primary.main" }}>{icon}</Box></Stack>
    <Typography variant="h4" fontWeight={700}>{value.toLocaleString("en-IN")}</Typography>
    {subtitle && <Typography variant="body2" color="text.secondary" mt={0.5}>{subtitle}</Typography>}
  </CardContent></Card>;
}
function StatusChip({ status }: { status: string }) {
  const color = status === "ACTIVE" ? "success" : status === "EXPIRED" ? "warning" : "error";
  return <Chip size="small" label={status} color={color as "success" | "warning" | "error"} />;
}
function RecentSchools({ schools }: { schools: RecentSchool[] }) {
  return <Card><CardContent><Typography variant="h6" fontWeight={700} mb={2}>Recent Schools</Typography><Stack divider={<Box sx={{ borderBottom:1, borderColor:"divider" }} />}>
    {schools.length === 0 && <Typography color="text.secondary">No schools found.</Typography>}
    {schools.map(s => <Stack key={s.schoolId} direction="row" justifyContent="space-between" alignItems="center" py={1.5} gap={2}>
      <Box sx={{ minWidth:0 }}><Typography fontWeight={600} noWrap>{s.name}</Typography><Typography variant="body2" color="text.secondary" noWrap>{s.phone || "No phone"} · {formatDate(s.createdAt)}</Typography></Box>
      <Chip size="small" label={s.status} color={s.status === "ACTIVE" ? "success" : "warning"} />
    </Stack>)}
  </Stack></CardContent></Card>;
}
function RecentSubscriptions({ subscriptions }: { subscriptions: RecentSubscription[] }) {
  return <Card><CardContent><Typography variant="h6" fontWeight={700} mb={2}>Recent Subscriptions</Typography><Stack divider={<Box sx={{ borderBottom:1, borderColor:"divider" }} />}>
    {subscriptions.length === 0 && <Typography color="text.secondary">No subscription activity found.</Typography>}
    {subscriptions.map(s => <Stack key={s.schoolId + s.updatedAt} direction="row" justifyContent="space-between" alignItems="center" py={1.5} gap={2}>
      <Box sx={{ minWidth:0 }}><Typography fontWeight={600} noWrap>{s.schoolName}</Typography><Typography variant="body2" color="text.secondary" noWrap>{s.planName} · Expires {s.expiresAt}</Typography></Box>
      <StatusChip status={s.status} />
    </Stack>)}
  </Stack></CardContent></Card>;
}
function Health({ icon, label, value }: { icon: React.ReactNode; label:string; value:number }) {
  return <Stack direction="row" alignItems="center" spacing={1.5} sx={{p:2,borderRadius:2,bgcolor:"background.default"}}>{icon}<Box><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h6" fontWeight={700}>{value}</Typography></Box></Stack>;
}
export function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard();
  const logout = () => { localStorage.removeItem("super_admin_token"); navigate("/login", { replace:true }); };
  return <Box sx={{ minHeight:"100vh", bgcolor:"background.default" }}>
    <AppBar position="sticky" elevation={0}><Toolbar><Typography variant="h6" fontWeight={700} sx={{ flexGrow:1 }}>School Super Admin</Typography><Button color="inherit" onClick={() => navigate("/schools")} sx={{ mr: 1 }}>Schools</Button><Typography variant="body2" sx={{ mr:2, display:{xs:"none",sm:"block"} }}>Platform Overview</Typography><Button color="inherit" onClick={logout}>Logout</Button></Toolbar></AppBar>
    <Box sx={{ p:{xs:2,md:4}, maxWidth:1440, mx:"auto" }}>
      <Stack direction={{xs:"column",sm:"row"}} justifyContent="space-between" alignItems={{xs:"flex-start",sm:"center"}} mb={3} gap={2}><Box><Typography variant="h4" fontWeight={800}>Dashboard</Typography><Typography color="text.secondary">Platform health and subscription overview</Typography></Box>{isFetching && !isLoading && <CircularProgress size={22} />}</Stack>
      {isLoading && <Box sx={{ py:10, textAlign:"center" }}><CircularProgress /><Typography color="text.secondary" mt={2}>Loading platform metrics...</Typography></Box>}
      {isError && <Alert severity="error" action={<Button size="small" onClick={() => refetch()}>Retry</Button>}>{(error as Error)?.message || "Unable to load dashboard data."}</Alert>}
      {data && <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid size={{xs:12,sm:6,lg:3}}><StatCard title="Total Schools" value={data.totalSchools} icon={<Business />} subtitle={`${data.activeSchools} active · ${data.suspendedSchools} suspended`} /></Grid>
          <Grid size={{xs:12,sm:6,lg:3}}><StatCard title="Active Students" value={data.activeStudents} icon={<People />} /></Grid>
          <Grid size={{xs:12,sm:6,lg:3}}><StatCard title="Active Teachers" value={data.activeTeachers} icon={<School />} /></Grid>
          <Grid size={{xs:12,sm:6,lg:3}}><StatCard title="Active Subscriptions" value={data.activeSubscriptions} icon={<CreditCard />} subtitle={`${data.expiredSubscriptions} expired · ${data.cancelledSubscriptions} cancelled`} /></Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{xs:12,lg:5}}><Card sx={{height:"100%"}}><CardContent><Typography variant="h6" fontWeight={700} mb={2}>Subscription Plans</Typography><Stack spacing={2}>
            {data.planDistribution.length === 0 && <Typography color="text.secondary">No subscription plans assigned yet.</Typography>}
            {data.planDistribution.map(p => { const total = Math.max(data.activeSubscriptions, 1); return <Box key={p.planId}><Stack direction="row" justifyContent="space-between"><Typography fontWeight={600}>{p.planName}</Typography><Typography variant="body2" color="text.secondary">{p.schoolCount} schools</Typography></Stack><LinearProgress variant="determinate" value={Math.min(100, p.schoolCount / total * 100)} sx={{height:8,borderRadius:4,mt:.75}} /><Typography variant="caption" color="text.secondary">{p.planCode}</Typography></Box>; })}
          </Stack></CardContent></Card></Grid>
          <Grid size={{xs:12,lg:7}}><Card><CardContent><Typography variant="h6" fontWeight={700} mb={2}>Subscription Health</Typography><Grid container spacing={2}>
            <Grid size={{xs:12,sm:4}}><Health icon={<CheckCircle />} label="Active" value={data.activeSubscriptions} /></Grid><Grid size={{xs:12,sm:4}}><Health icon={<Warning />} label="Expired" value={data.expiredSubscriptions} /></Grid><Grid size={{xs:12,sm:4}}><Health icon={<Cancel />} label="Cancelled" value={data.cancelledSubscriptions} /></Grid>
          </Grid></CardContent></Card></Grid>
        </Grid>
        <Grid container spacing={2}><Grid size={{xs:12,lg:6}}><RecentSchools schools={data.recentSchools} /></Grid><Grid size={{xs:12,lg:6}}><RecentSubscriptions subscriptions={data.recentSubscriptions} /></Grid></Grid>
      </Stack>}
    </Box>
  </Box>;
}