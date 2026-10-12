import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, InputAdornment, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Add, Edit, Refresh, Search } from "@mui/icons-material";
import { useCreatePlan, usePlans, useUpdatePlan, useChangePlanStatus } from "../../hooks/usePlans";
import type { SubscriptionPlan, SubscriptionPlanRequest } from "../../types/plan";

const emptyForm: SubscriptionPlanRequest = { code: "", name: "", maxStudents: 100, maxTeachers: 10, annualPrice: 0 };
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

function PlanForm({ open, plan, loading, error, onClose, onSubmit }: {
  open: boolean; plan?: SubscriptionPlan; loading: boolean; error?: string;
  onClose: () => void; onSubmit: (request: SubscriptionPlanRequest) => void;
}) {
  const [form, setForm] = useState<SubscriptionPlanRequest>(emptyForm);
  useEffect(() => {
    if (open) setForm(plan ? { code: plan.code, name: plan.name, maxStudents: plan.maxStudents, maxTeachers: plan.maxTeachers, annualPrice: plan.annualPrice } : { ...emptyForm });
  }, [open, plan]);
  const set = (field: keyof SubscriptionPlanRequest, value: string) => setForm(current => ({ ...current, [field]: field === "code" || field === "name" ? value : Number(value) }));
  const valid = Boolean(form.code.trim() && form.name.trim() && Number.isInteger(form.maxStudents) && form.maxStudents > 0 && Number.isInteger(form.maxTeachers) && form.maxTeachers > 0 && Number.isFinite(form.annualPrice) && form.annualPrice >= 0);
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{plan ? "Edit subscription plan" : "Create subscription plan"}</DialogTitle>
    <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Plan code" value={form.code} onChange={e => set("code", e.target.value.toUpperCase().replace(/\\s+/g, "_"))} required helperText="Unique code, e.g. BASIC or PREMIUM" inputProps={{ maxLength: 50 }} />
      <TextField label="Plan name" value={form.name} onChange={e => set("name", e.target.value)} required inputProps={{ maxLength: 100 }} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Maximum students" value={form.maxStudents} onChange={e => set("maxStudents", e.target.value)} required inputProps={{ min: 1, step: 1 }} /></Grid>
        <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Maximum teachers" value={form.maxTeachers} onChange={e => set("maxTeachers", e.target.value)} required inputProps={{ min: 1, step: 1 }} /></Grid>
      </Grid>
      <TextField label="Annual price (₹)" type="number" value={form.annualPrice} onChange={e => set("annualPrice", e.target.value)} required inputProps={{ min: 0, step: 0.01 }} helperText="Price for one year" />
    </Stack></DialogContent>
    <DialogActions sx={{ p: 2 }}><Button onClick={onClose} disabled={loading}>Cancel</Button><Button variant="contained" disabled={loading || !valid} onClick={() => onSubmit({ ...form, code: form.code.trim().toUpperCase(), name: form.name.trim() })}>{loading ? "Saving..." : plan ? "Save changes" : "Create plan"}</Button></DialogActions>
  </Dialog>;
}

export function PlansPage() {
  const { data: plans = [], isLoading, isError, error, refetch, isFetching } = usePlans();
  const create = useCreatePlan(); const update = useUpdatePlan(); const status = useChangePlanStatus();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SubscriptionPlan>();
  const [confirm, setConfirm] = useState<SubscriptionPlan>();
  const [mutationError, setMutationError] = useState("");
  const filtered = useMemo(() => plans.filter(plan => {
    const text = (plan.name + " " + plan.code).toLowerCase().includes(search.toLowerCase());
    return text && (filter === "ALL" || (filter === "ACTIVE" ? plan.active : !plan.active));
  }), [plans, search, filter]);
  const closeForm = () => { setFormOpen(false); setEditing(undefined); setMutationError(""); };
  const submit = (request: SubscriptionPlanRequest) => {
    setMutationError("");
    const options = { onSuccess: closeForm, onError: (err: unknown) => setMutationError((err as any)?.response?.data?.message || "Unable to save the plan. Please try again.") };
    if (editing) update.mutate({ id: editing.id, request }, options);
    else create.mutate(request, options);
  };
  const changeStatus = () => {
    if (!confirm) return;
    status.mutate({ id: confirm.id, active: !confirm.active }, {
      onSuccess: () => setConfirm(undefined),
      onError: (err: unknown) => { setMutationError((err as any)?.response?.data?.message || "Unable to change plan status."); setConfirm(undefined); },
    });
  };
  return <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1440, mx: "auto" }}>
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2} mb={3}>
      <Box><Typography variant="h4" fontWeight={800}>Subscription Plans</Typography><Typography color="text.secondary">Create pricing plans and control platform limits</Typography></Box>
      <Button variant="contained" startIcon={<Add />} onClick={() => { setEditing(undefined); setMutationError(""); setFormOpen(true); }}>Create Plan</Button>
    </Stack>
    {mutationError && !formOpen && <Alert severity="error" onClose={() => setMutationError("")} sx={{ mb: 2 }}>{mutationError}</Alert>}
    <Card><CardContent>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
        <TextField fullWidth placeholder="Search by plan name or code" value={search} onChange={e => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
        <TextField select label="Status" value={filter} onChange={e => setFilter(e.target.value as typeof filter)} sx={{ minWidth: 180 }}><MenuItem value="ALL">All plans</MenuItem><MenuItem value="ACTIVE">Active</MenuItem><MenuItem value="INACTIVE">Inactive</MenuItem></TextField>
        <Tooltip title="Refresh plans"><span><IconButton onClick={() => refetch()} disabled={isFetching}><Refresh /></IconButton></span></Tooltip>
      </Stack>
      {isLoading && <Box sx={{ py: 8, textAlign: "center" }}><CircularProgress /></Box>}
      {isError && <Alert severity="error" action={<Button size="small" onClick={() => refetch()}>Retry</Button>}>{(error as Error).message || "Unable to load subscription plans."}</Alert>}
      {!isLoading && !isError && <Stack divider={<Divider />}>
        {filtered.length === 0 && <Typography color="text.secondary" sx={{ py: 5, textAlign: "center" }}>{plans.length ? "No plans match your filters." : "No subscription plans found. Create your first plan to get started."}</Typography>}
        {filtered.map(plan => <Stack key={plan.id} direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} justifyContent="space-between" gap={2} py={2}>
          <Box sx={{ minWidth: 0, flex: 1 }}><Stack direction="row" alignItems="center" gap={1} flexWrap="wrap"><Typography fontWeight={750} variant="h6">{plan.name}</Typography><Chip size="small" label={plan.code} variant="outlined" /><Chip size="small" label={plan.active ? "Active" : "Inactive"} color={plan.active ? "success" : "default"} /></Stack>
            <Typography variant="body2" color="text.secondary" mt={0.5}>Up to {plan.maxStudents.toLocaleString("en-IN")} students · {plan.maxTeachers.toLocaleString("en-IN")} teachers</Typography></Box>
          <Stack direction="row" alignItems="center" spacing={2}><Box sx={{ textAlign: { xs: "left", md: "right" }, minWidth: 130 }}><Typography variant="h6" fontWeight={800}>{money.format(plan.annualPrice)}</Typography><Typography variant="caption" color="text.secondary">per year</Typography></Box>
            <Tooltip title="Edit plan"><IconButton onClick={() => { setEditing(plan); setMutationError(""); setFormOpen(true); }}><Edit /></IconButton></Tooltip>
            <Button size="small" color={plan.active ? "warning" : "success"} disabled={status.isPending} onClick={() => setConfirm(plan)}>{plan.active ? "Deactivate" : "Activate"}</Button>
          </Stack>
        </Stack>)}
      </Stack>}
      {isFetching && !isLoading && <Box sx={{ pt: 1 }}><Typography variant="caption" color="text.secondary">Refreshing…</Typography></Box>}
    </CardContent></Card>
    <PlanForm open={formOpen} plan={editing} loading={create.isPending || update.isPending} error={mutationError} onClose={closeForm} onSubmit={submit} />
    <Dialog open={Boolean(confirm)} onClose={() => setConfirm(undefined)}>
      <DialogTitle>{confirm?.active ? "Deactivate plan?" : "Activate plan?"}</DialogTitle>
      <DialogContent>{confirm?.active ? "This plan will no longer be available for new assignments. Existing school subscriptions are not automatically removed. " : "This plan will be available for school subscriptions. "}Continue with <b>{confirm?.name}</b>?</DialogContent>
      <DialogActions><Button onClick={() => setConfirm(undefined)} disabled={status.isPending}>Cancel</Button><Button variant="contained" color={confirm?.active ? "warning" : "success"} onClick={changeStatus} disabled={status.isPending}>{status.isPending ? "Updating..." : confirm?.active ? "Deactivate" : "Activate"}</Button></DialogActions>
    </Dialog>
  </Box>;
}
