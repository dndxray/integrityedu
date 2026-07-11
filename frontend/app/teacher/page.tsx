"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AddIcon from "@mui/icons-material/Add";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import InsightsIcon from "@mui/icons-material/Insights";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CircleIcon from "@mui/icons-material/Circle";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

interface ClassData {
  id: number;
  class_name: string;
  class_code: string;
  description: string;
}

// Warna aksen per kartu statistik. Disatukan di sini biar gampang di-tweak
// dan konsisten dipakai di stat card + ikonnya.
const statCardStyle = {
  totalClasses: { bg: "#EEF2FF", fg: "#4338CA" },
  assignments: { bg: "#ECFDF5", fg: "#059669" },
  students: { bg: "#FFF7ED", fg: "#C2410C" },
  alerts: { bg: "#FEF2F2", fg: "#DC2626" },
};

 

function StatCard({
  label,
  value,
  icon,
  colors,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  colors: { bg: string; fg: string };
}) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
        border: "1px solid #EEF0F3",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: colors.bg,
              color: colors.fg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 13 }}>
              {label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function TeacherPage() {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClasses() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://127.0.0.1:8000/classes/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        // API idealnya selalu balikin array. Kalau bukan (mis. balikin
        // { detail: "..." } waktu error auth), jangan panggil .map di array
        // kosong dan tampilkan pesan error yang jelas.
        if (Array.isArray(data)) {
          setClasses(data);
        } else {
          console.error("Unexpected /classes/my response:", data);
          setLoadError(
            data?.detail ?? "Gagal memuat data kelas. Coba muat ulang halaman."
          );
          setClasses([]);
        }
      } catch (err) {
        console.error(err);
        setLoadError("Gagal terhubung ke server. Coba muat ulang halaman.");
        setClasses([]);
      } finally {
        setLoading(false);
      }
    }

    loadClasses();
  }, []);

  return (
    <>
      <Sidebar />
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F8FAFC",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            ml: {
              xs: 0,
              md: "280px",
            },
            pt: {
              xs: 10,
              md: 12,
            },
            pb: 5,
            px: {
              xs: 2,
              md: 4,
            },
            maxWidth: {
              md: "calc(100vw - 280px)",
            },
          }}
        >
          <Stack
            sx={{
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 2,
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Dashboard
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                Manage your classes and monitor learning activities.
              </Typography>
            </Box>
 
          </Stack>

          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Total Classes"
                value={classes.length}
                icon={<SchoolIcon />}
                colors={statCardStyle.totalClasses}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Assignments"
                value="--"
                icon={<AssignmentIcon />}
                colors={statCardStyle.assignments}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Students"
                value="--"
                icon={<GroupsIcon />}
                colors={statCardStyle.students}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="AI Alerts"
                value="--"
                icon={<WarningAmberIcon />}
                colors={statCardStyle.alerts}
              />
            </Grid>
          </Grid>
 
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2.5,
                }}
              >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    My Classes
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                    Click a class to manage assignments.
                  </Typography>
                </Box>
              </Stack>
 
              {loadError && (
                <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
                  {loadError}
                </Alert>
              )}

              {loading ? (
                <Grid container spacing={2.5}>
                  {[1, 2, 3, 4].map((i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6 }}>
                      <Skeleton
                        variant="rounded"
                        height={140}
                        sx={{ borderRadius: 3 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : classes.length === 0 ? (
                <Card
                  sx={{
                    borderRadius: 3,
                    border: "1px dashed #CBD5E1",
                    boxShadow: "none",
                    bgcolor: "transparent",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 6 }}>
                    <SchoolIcon
                      sx={{ fontSize: 40, color: "text.disabled" }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
                      Belum ada kelas
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                      Buat kelas pertamamu untuk mulai memantau aktivitas
                      belajar.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ borderRadius: 2, textTransform: "none" }}
                      onClick={() => router.push("/teacher/create-class")}
                    >
                      Create Class
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Grid container spacing={2.5}>
                  {classes.map((cls) => (
                    <Grid key={cls.id} size={{ xs: 12, sm: 6 }}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
                          border: "1px solid #EEF0F3",
                          height: "100%",
                        }}
                      >
                        <CardActionArea
                          onClick={() =>
                            router.push(`/teacher/class/${cls.id}`)
                          }
                          sx={{ height: "100%" }}
                        >
                          <CardContent>
                            <Stack
                              sx={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 1.5,
                              }}
                            >
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {cls.class_name}
                              </Typography>
                              <Chip
                                label={cls.class_code}
                                size="small"
                                sx={{
                                  bgcolor: "#EEF2FF",
                                  color: "#4338CA",
                                  fontWeight: 600,
                                }}
                              />
                            </Stack>
                            <Typography
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {cls.description || "Belum ada deskripsi."}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
