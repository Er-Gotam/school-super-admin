import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, FormControl, InputLabel, MenuItem, Select, Stack, Tooltip, Typography } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useSchools } from "../../hooks/useSchools";
import { usePlans } from "../../hooks/usePlans";
import { useAssignSchoolPlan, useRenewSchoolSubscription, useSchoolSubscriptionUsage } from "../../hooks/useSubscriptions";
import type { School } from "../../types/school";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });
function date(value: string | null | undefined) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : dateFormatter.format(parsed);
}
function Status({ value }: { value: string | null | undefined }) {
  if (!value) return <Chip size="small" label="No subscription" />;
  const color = value === "ACTIVE" ? "success" : value === "EXPIRED" ? "warning" : "default";
  return <Chip size="small" label={value} color={color as "success" | "warning" | "default"} />;
}

function SchoolSubscriptionRow({ school, onError }: { school: School; onError: (message: string) => void }) {
  const usage = useSchoolSubscriptionUsage(school.id);
  const assign = useAssignSchoolPlan();
  const renew = useRenewSchoolSubscription();
  const [selectedPlan, setSelectedPlan] = useState("");
  const plans = usePlans();
  const activePlans = (plans.data ?? []).filter(plan => plan.active);
  const currentPlanId = usage.data?.planId == null ? "" : String(usage.data.planId);
  const planSelection = selectedPlan || currentPlanId;
  const busy = assign.isPending || renew.isPending;
  const handleAssign = () => {
    if (!planSelection) return;
    onError("");
    assign.mutate({ schoolId: school.id, planId: Number(planSelection) }, {
      onSuccess: () => setSelectedPlan(""),
      onError: (err: unknown) => onError((err as any)?.response?.data?.message || "Unable to assign a plan to " + school.name + "."),
    });
  };
  const handleRenew = () => {
    onError("");
    renew.mutate(school.id, {
      onError: (err: unknown) => onError((err as any)?.response?.data?.message || "Unable to renew subscription for " + school.name + "."),
    });
  };
  return <Box sx={{ py: 2.5 }}>
    <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" gap={2}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
          <Typography fontWeight={750} variant="h6">{school.name}</Typography>
          <Chip size="small" label={school.status} color={school.status === "ACTIVE" ? "success" : "warning"} variant="outlined" />
          <Status value={usage.data?.status} />
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={0.5}>{school.phone || "No phone"} · {school.address || "No address"}</Typography>
        {usage.isLoading && <Stack direction="row" spacing={1} alignItems="center" mt={2}><CircularProgress size={16} /><Typography variant="body2" color="text.secondary">Loading subscription usage…</Typography></Stack>}
        {usage.isError && <Alert severity="info" sx={{ mt: 1 }}>Subscription usage is unavailable. Assign a plan or refresh to try again.</Alert>}
        {usage.data && <Stack direction={{ xs: "column", sm: "row" }} flexWrap="wrap" gap={1} mt={1.5}>
          <Chip variant="outlined" label={`Plan: ${usage.data.planName || "Not assigned"}`} />
          <Chip variant="outlined" label={`Students: ${usage.data.studentsUsed}/${usage.data.maxStudents}`} />
          <Chip variant="outlined" label={`Teachers: ${usage.data.teachersUsed}/${usage.data.maxTeachers}`} />
          <Chip variant="outlined" label={`Start: ${date(usage.data.startsAt)}`} />
          <Chip variant="outlined" label={`Expiry: ${date(usage.data.expiresAt)}`} />
        </Stack>}
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={1} sx={{ minWidth: { lg: 390 } }}>
        <FormControl size="small" sx={{ minWidth: 170, flex: 1 }}>
          <InputLabel id={`plan-label-${school.id}`}>Subscription plan</InputLabel>
          <Select labelId={`plan-label-${school.id}`} label="Subscription plan" value={planSelection} onChange={e => setSelectedPlan(String(e.target.value))} disabled={plans.isLoading || activePlans.length === 0}>
            {activePlans.map(plan => <MenuItem key={plan.id} value={String(plan.id)}>{plan.name} · ₹{plan.annualPrice.toLocaleString("en-IN")}/yr</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="contained" size="medium" disabled={busy || !planSelection || planSelection === currentPlanId} onClick={handleAssign}>Assign plan</Button>
        <Tooltip title="Renew the school's current subscription"><span><Button variant="outlined" disabled={busy || !usage.data?.planId} onClick={handleRenew}>Renew</Button></span></Tooltip>
      </Stack>
    </Stack>
    {assign.isPending || renew.isPending ? <Box sx={{ mt: 1 }}><CircularProgress size={16} /></Box> : null}
    {assign.isSuccess && <Typography variant="caption" color="success.main">Plan assigned successfully.</Typography>}
    {renew.isSuccess && <Typography variant="caption" color="success.main">Subscription renewed successfully.</Typography>}
  </Box>;
}

export function SubscriptionsPage() {
  const schools = useSchools();
  const plans = usePlans();
  const [errorMessage, setErrorMessage] = useState("");
  return <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1440, mx: "auto" }}>
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2} mb={3}>
      <Box><Typography variant="h4" fontWeight={800}>School Subscriptions</Typography><Typography color="text.secondary">Assign plans, monitor usage and renew school subscriptions</Typography></Box>
      <Button variant="outlined" startIcon={<Refresh />} onClick={() => { void schools.refetch(); void plans.refetch(); }}>Refresh</Button>
    </Stack>
    {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")} sx={{ mb: 2 }}>{errorMessage}</Alert>}
    {plans.isError && <Alert severity="warning" sx={{ mb: 2 }}>Subscription plans could not be loaded. Check the Plans page and retry.</Alert>}
    <Card><CardContent>
      {schools.isLoading && <Box sx={{ py: 8, textAlign: "center" }}><CircularProgress /></Box>}
      {schools.isError && <Alert severity="error" action={<Button size="small" onClick={() => schools.refetch()}>Retry</Button>}>{(schools.error as Error).message || "Unable to load schools."}</Alert>}
      {!schools.isLoading && !schools.isError && schools.data?.length === 0 && <Typography color="text.secondary" sx={{ py: 5, textAlign: "center" }}>No schools found. Create a school first.</Typography>}
      {!schools.isLoading && !schools.isError && <Stack divider={<Divider />}>
        {(schools.data ?? []).map(school => <SchoolSubscriptionRow key={school.id} school={school} onError={setErrorMessage} />)}
      </Stack>}
    </CardContent></Card>
  </Box>;
}
