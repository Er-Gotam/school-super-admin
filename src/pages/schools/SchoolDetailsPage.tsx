import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useSchool } from "../../hooks/useSchools";

export function SchoolDetailsPage() {
  const { schoolId } = useParams(); const navigate = useNavigate();
  const { data: school, isLoading, isError, error } = useSchool(schoolId);
  if (isLoading) return <Box sx={{p:6,textAlign:"center"}}><CircularProgress /></Box>;
  if (isError || !school) return <Box sx={{p:4}}><Alert severity="error">{(error as Error)?.message || "School not found."}</Alert></Box>;
  return <Box sx={{p:{xs:2,md:4},maxWidth:1000,mx:"auto"}}><Button startIcon={<ArrowBack />} onClick={()=>navigate("/schools")} sx={{mb:2}}>Back to Schools</Button>
    <Card><CardContent><Stack spacing={3}><Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography variant="h4" fontWeight={800}>{school.name}</Typography><Typography color="text.secondary">School details</Typography></Box><Chip label={school.status} color={school.status === "ACTIVE" ? "success" : "warning"} /></Stack>
      <Stack spacing={2}><Typography><b>Phone:</b> {school.phone}</Typography><Typography><b>Address:</b> {school.address || "Not provided"}</Typography><Typography><b>School ID:</b> {school.id}</Typography></Stack>
      <Button variant="outlined" startIcon={<Edit />} onClick={()=>navigate("/schools")}>Edit from Schools</Button>
    </Stack></CardContent></Card></Box>;
}