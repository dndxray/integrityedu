"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import ChecklistRtlRoundedIcon from "@mui/icons-material/ChecklistRtlRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import { getAssignments } from "@/services/assignment";
import { getClassDetail } from "@/services/class";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
}

// TODO: field-field ini belum ada di backend (status tugas, jumlah
// pengumpulan, terdeteksi AI). Sementara di-cycle dari array dummy biar
// tampilan kartu tugas nggak polos. Ganti begitu endpoint-nya nyedia.
const demoAssignmentMeta = [
  { status: "Aktif", statusColor: "#059669", submitted: 18, total: 24, aiFlagged: 3 },
  { status: "Ditutup", statusColor: "#64748B", submitted: 24, total: 24, aiFlagged: 1 },
  { status: "Aktif", statusColor: "#059669", submitted: 5, total: 24, aiFlagged: 0 },
];

const tabs = [
  { key: "tugas", label: "Tugas", icon: <DescriptionRoundedIcon fontSize="small" /> },
  { key: "siswa", label: "Siswa", icon: <PeopleAltRoundedIcon fontSize="small" /> },
  { key: "analitik", label: "Analitik", icon: <BarChartRoundedIcon fontSize="small" /> },
];

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [classroom, setClassroom] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState("tugas");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");

      if (!token) return;

      const classData = await getClassDetail(
        token,
        Number(params.id)
      );

      setClassroom(classData);

      const assignmentData = await getAssignments(
        token,
        Number(params.id)
      );

      setAssignments(assignmentData);
    }

    loadData();
  }, [params.id]);

  function copyClassCode() {
    if (!classroom?.class_code) return;
    navigator.clipboard.writeText(classroom.class_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!classroom) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Sidebar />
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F5F7FB",
        }}
      >
        {/* Header putih: back link, avatar+judul kelas, kode kelas, tombol buat tugas */}
        <Box
          sx={{
            bgcolor: "white",
            borderBottom: "1px solid #EEF0F3",
            pb: 3,
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              ml: { xs: 0, md: "280px" },
              maxWidth: { md: "calc(100vw - 280px)" },
              pt: { xs: 9, md: 4 },
              px: { xs: 2, md: 4 },
            }}
          >
            <Typography
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: "text.secondary",
                fontSize: 14,
                cursor: "pointer",
                mb: 2,
                "&:hover": { color: "text.primary" },
              }}
              onClick={() => router.push("/teacher")}
            >
              <ArrowBackRoundedIcon fontSize="small" />
              Kembali ke Daftar Kelas
            </Typography>

            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
              }}
            >
              <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 48,
                    height: 48,
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  {classroom.class_name?.charAt(0) ?? "?"}
                </Avatar>

                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    {classroom.class_name}
                  </Typography>
                  <Typography color="text.secondary" fontSize={14}>
                    {classroom.description || "Kelas"}
                  </Typography>
                </Box>
              </Stack>

              <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
                <Chip
                  label={copied ? "Disalin!" : classroom.class_code}
                  onClick={copyClassCode}
                  icon={<ContentCopyRoundedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    bgcolor: "#F1F5F9",
                    color: "text.primary",
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    borderRadius: 2,
                    cursor: "pointer",
                    px: 0.5,
                  }}
                />

                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    px: 2.5,
                  }}
                  onClick={() =>
                    router.push(
                      `/teacher/class/${params.id}/create-assignment`
                    )
                  }
                >
                  Buat Tugas
                </Button>
              </Stack>
            </Stack>

            {/* Stat row: cuma "Tugas Aktif" pakai data asli (assignments.length),
                sisanya hardcode sampai endpoint-nya ada. */}
            <Stack
              sx={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: { xs: 3, md: 5 },
                mt: 4,
              }}
            >
              <StatItem
                icon={<GroupsRoundedIcon fontSize="small" />}
                iconColor="#4338CA"
                iconBg="#EEF2FF"
                label="Total Siswa"
                value="8" // TODO: belum ada endpoint jumlah siswa per kelas
              />
              <StatItem
                icon={<AssignmentRoundedIcon fontSize="small" />}
                iconColor="#0891B2"
                iconBg="#ECFEFF"
                label="Tugas Aktif"
                value={assignments.length}
              />
              <StatItem
                icon={<ChecklistRtlRoundedIcon fontSize="small" />}
                iconColor="#059669"
                iconBg="#ECFDF5"
                label="Pengumpulan"
                value="47" // TODO: agregat dari endpoint submission
              />
              <StatItem
                icon={<WarningAmberRoundedIcon fontSize="small" />}
                iconColor="#D97706"
                iconBg="#FFF7ED"
                label="Terindikasi AI"
                value="2" // TODO: agregat dari endpoint deteksi AI
              />
              <StatItem
                icon={<VerifiedUserRoundedIcon fontSize="small" />}
                iconColor="#059669"
                iconBg="#ECFDF5"
                label="Rata-rata Integritas"
                value="90%" // TODO: agregat dari endpoint skor integritas
                valueColor="#059669"
              />
            </Stack>
          </Container>
        </Box>

        {/* Tabs: cuma "Tugas" yang beneran render konten asli. "Siswa" &
            "Analitik" masih placeholder, belum ada endpoint-nya. */}
        <Container
          maxWidth="lg"
          sx={{
            ml: { xs: 0, md: "280px" },
            maxWidth: { md: "calc(100vw - 280px)" },
            px: { xs: 2, md: 4 },
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              gap: 3,
              borderBottom: "1px solid #E5E7EB",
              mb: 3,
            }}
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <Stack
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 0.8,
                    py: 1.5,
                    cursor: "pointer",
                    color: active ? "primary.main" : "text.secondary",
                    borderBottom: active ? "2px solid" : "2px solid transparent",
                    borderColor: active ? "primary.main" : "transparent",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {tab.icon}
                  <Typography fontWeight={active ? 700 : 500} fontSize={14.5} color="inherit">
                    {tab.label}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>

          <Box sx={{ pb: 6 }}>
            {activeTab === "tugas" && (
              <>
                {assignments.length === 0 ? (
                  <Card sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid #EEF0F3" }}>
                    <CardContent>
                      <Typography align="center" color="text.secondary">
                        No assignments available.
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  <Stack sx={{ gap: 2.5 }}>
                    {assignments.map((item, index) => {
                      // TODO: meta ini dummy, ganti begitu backend nyediain
                      // status/progress/deteksi AI asli per tugas.
                      const meta =
                        demoAssignmentMeta[index % demoAssignmentMeta.length];
                      const percent = Math.round(
                        (meta.submitted / meta.total) * 100
                      );

                      return (
                        <Card
                          key={item.id}
                          sx={{
                            borderRadius: 2,
                            boxShadow: "none",
                            border: "1px solid #EEF0F3",
                            cursor: "pointer",
                            transition: ".2s",
                            "&:hover": {
                              boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
                            },
                          }}
                          onClick={() =>
                            router.push(`/teacher/assignment/${item.id}`)
                          }
                        >
                          <CardContent>
                            <Stack
                              sx={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 2,
                              }}
                            >
                              <Stack sx={{ flexDirection: "row", gap: 1.5 }}>
                                <Box
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 1.5,
                                    bgcolor: "#EEF2FF",
                                    color: "#4338CA",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <DescriptionRoundedIcon fontSize="small" />
                                </Box>

                                <Box>
                                  <Stack
                                    sx={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography variant="subtitle1" fontWeight={700}>
                                      {item.title}
                                    </Typography>
                                    <Chip
                                      size="small"
                                      label={meta.status}
                                      sx={{
                                        bgcolor: `${meta.statusColor}1A`,
                                        color: meta.statusColor,
                                        fontWeight: 600,
                                        height: 22,
                                      }}
                                    />
                                  </Stack>
                                  <Typography color="text.secondary" fontSize={14} mt={0.3}>
                                    {item.description}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Stack>

                            <Box sx={{ mt: 2.5 }}>
                              <Stack
                                sx={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  mb: 0.7,
                                }}
                              >
                                <Typography fontSize={13} color="text.secondary">
                                  {meta.submitted} / {meta.total} dikumpulkan
                                </Typography>
                                <Typography fontSize={13} fontWeight={700}>
                                  {percent}%
                                </Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={percent}
                                sx={{
                                  height: 8,
                                  borderRadius: 999,
                                  bgcolor: "#EEF0F3",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 999,
                                    bgcolor: percent >= 100 ? "#059669" : "primary.main",
                                  },
                                }}
                              />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Stack
                              sx={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Stack
                                sx={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 0.7,
                                  color: "text.secondary",
                                }}
                              >
                                <CalendarTodayRoundedIcon sx={{ fontSize: 15 }} />
                                <Typography fontSize={13}>
                                  Deadline:{" "}
                                  {new Date(item.deadline).toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )}
                                </Typography>
                              </Stack>

                              {meta.aiFlagged > 0 && (
                                <Chip
                                  size="small"
                                  icon={
                                    <AutoAwesomeRoundedIcon
                                      sx={{ fontSize: 14, color: "#D97706 !important" }}
                                    />
                                  }
                                  label={`${meta.aiFlagged} terindikasi AI`}
                                  sx={{
                                    bgcolor: "#FFF7ED",
                                    color: "#D97706",
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </>
            )}

            {activeTab === "siswa" && (
              <Card sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid #EEF0F3" }}>
                <CardContent sx={{ textAlign: "center", py: 6 }}>
                  <PeopleAltRoundedIcon sx={{ fontSize: 36, color: "text.disabled" }} />
                  <Typography color="text.secondary" mt={1.5}>
                    {/* TODO: belum ada endpoint daftar siswa per kelas */}
                    Daftar siswa belum tersedia.
                  </Typography>
                </CardContent>
              </Card>
            )}

            {activeTab === "analitik" && (
              <Card sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid #EEF0F3" }}>
                <CardContent sx={{ textAlign: "center", py: 6 }}>
                  <BarChartRoundedIcon sx={{ fontSize: 36, color: "text.disabled" }} />
                  <Typography color="text.secondary" mt={1.5}>
                    {/* TODO: belum ada endpoint analitik kelas */}
                    Analitik belum tersedia.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

function StatItem({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  label: string;
  value: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.2 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1.25,
          bgcolor: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography fontSize={13} color="text.secondary">
          {label}
        </Typography>
        <Typography fontWeight={800} fontSize={17} sx={{ color: valueColor }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}