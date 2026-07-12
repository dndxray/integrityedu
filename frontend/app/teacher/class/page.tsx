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
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import BrushRoundedIcon from "@mui/icons-material/BrushRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import Sidebar from "@/components/Sidebar";
// import Navbar from "@/components/Navbar";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
interface ClassData {
  id: number;
  class_name: string;
  class_code: string;
  description: string;
}

const statCardStyle = {
  totalClasses: { bg: "#EEF2FF", fg: "#4338CA" },
  assignments: { bg: "#ECFDF5", fg: "#059669" },
  students: { bg: "#FFF7ED", fg: "#C2410C" },
  alerts: { bg: "#FEF2F2", fg: "#DC2626" },
};

// TODO: field ini belum ada di backend (ikon subjek, jumlah tugas, jumlah
// siswa). Sementara di-cycle dari array dummy pakai warna yang sama kayak
// statCardStyle di atas, biar tetap satu tema. Ganti begitu backend
// nyediain field aslinya.
const classCardMeta = [
  { bg: "#ECFDF5", fg: "#059669", icon: <ScienceRoundedIcon fontSize="small" />, tugas: 4, siswa: 24 },
  { bg: "#FFF7ED", fg: "#C2410C", icon: <PeopleAltRoundedIcon fontSize="small" />, tugas: 6, siswa: 18 },
  { bg: "#FEF2F2", fg: "#DC2626", icon: <BrushRoundedIcon fontSize="small" />, tugas: 2, siswa: 22 },
  { bg: "#EEF2FF", fg: "#4338CA", icon: <ComputerRoundedIcon fontSize="small" />, tugas: 5, siswa: 20 },
  { bg: "#F5F3FF", fg: "#7C3AED", icon: <CalculateRoundedIcon fontSize="small" />, tugas: 3, siswa: 26 },
  { bg: "#FEFCE8", fg: "#CA8A04", icon: <TranslateRoundedIcon fontSize="small" />, tugas: 7, siswa: 19 },
];

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
        borderRadius: 2,
        boxShadow: "none",
        border: "1px solid #D9E3F0",
        height: "100%",
        borderColor: "#2C6E9E",
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

        const response = await fetch(
  `${API_URL}/classes/my`,
  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
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
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#EAF4FF",
          ml: { xs: 0, md: "260px" },
          p: { xs: 1.5, md: 3 },
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            minHeight: { md: "calc(100vh - 48px)" },
            boxShadow: "0 20px 45px -20px rgba(51,70,196,0.15)",
            p: { xs: 2.5, md: 4 },
          }}
        >
          {/* Sapaan + search bar — nama guru & pencarian masih dekoratif,
              belum ada endpoint profil guru / search asli. */}
          <Box sx={{ mb: 3 }}>
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                gap: 1.2,
                bgcolor: "#F5F6FB",
                borderRadius: 999,
                px: 2.5,
                py: 1.1,
                mt: 2.5,
                width: { xs: "100%", sm: 320 },
              }}
            >
              <SearchRoundedIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "#94A3B8", fontSize: 14.5 }}>
                {/* TODO: belum tersambung ke pencarian beneran */}
                Cari kelas...
              </Typography>
            </Stack>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
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

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                  onClick={() => router.push("/teacher/create-class")}
                >
                  Create Class
                </Button>
              </Stack>

              {loadError && (
                <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
                  {loadError}
                </Alert>
              )}

              {loading ? (
                <Grid container spacing={2.5}>
                  {[1, 2, 3, 4].map((i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
                      <Skeleton
                        variant="rounded"
                        height={170}
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
                  {classes.map((cls, index) => {
                    const meta = classCardMeta[index % classCardMeta.length];

                    return (
                      <Grid key={cls.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                        <Card
                          sx={{
                            borderRadius: 2,
                            boxShadow: "none",
                            border: `1px solid #DCE6F2`,
                            bgcolor: meta.bg,
                            height: "100%",
                            transition: "all .2s ease",
                          }}
                        >
                          <CardActionArea
                            onClick={() =>
                              router.push(`/teacher/class/${cls.id}`)
                            }
                            sx={{ height: "100%" }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
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
                              </Stack>

                              <Chip
                                label={cls.class_code}
                                size="small"
                                sx={{
                                  bgcolor: "white",
                                  color: meta.fg,
                                  fontWeight: 600,
                                  mb: 1.5,
                                }}
                              />

                              <Typography
                                variant="body2"
                                sx={{
                                  color: "text.secondary",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  mb: 2,
                                }}
                              >
                                {cls.description || "Belum ada deskripsi."}
                              </Typography>

                              <Divider sx={{ mb: 1.5, borderColor: "rgba(0,0,0,0.06)" }} />

                              <Stack sx={{ flexDirection: "row", gap: 2.5 }}>
                                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.6 }}>
                                  <AssignmentIcon sx={{ fontSize: 15, color: meta.fg }} />
                                  <Typography variant="body2" sx={{ fontSize: 13, color: "text.secondary" }}>
                                    {meta.tugas} Tugas
                                  </Typography>
                                </Stack>

                                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.6 }}>
                                  <GroupsIcon sx={{ fontSize: 15, color: meta.fg }} />
                                  <Typography variant="body2" sx={{ fontSize: 13, color: "text.secondary" }}>
                                    {meta.siswa} Siswa
                                  </Typography>
                                </Stack>
                              </Stack>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}