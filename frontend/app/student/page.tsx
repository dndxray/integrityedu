"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StudentSidebar from "@/components/StudentSidebar";
import JoinClassModal from "@/components/JoinClassModal";
import { getMyClasses } from "@/services/student";

const API_URL = "http://127.0.0.1:8000";

// TODO: field ini belum ada di backend (guru, jumlah tugas, status, jumlah
// file, gradasi warna kartu). Sementara di-cycle dari array dummy biar
// tampilan kelas nggak polos. Ganti begitu backend nyediain field aslinya.
const classDemoMeta = [
  {
    gradient: "linear-gradient(135deg, #3F5F9CCC 0%, #587DB2CC 80%)",
    teacher: "Pak Budi Santoso",
    tugas: 3,
    tertunda: 1,
    files: 10,
    avatarColors: ["#FDBA74", "#F472B6", "#818CF8"],
    extraStudents: 4,
  },
];

// TODO: belum ada endpoint tugas per siswa. Ini data contoh statis dulu.
const recentAssignments = [
  {
    id: 1,
    title: "Soal Integral Substitusi",
    subject: "Matematika Lanjutan",
    dueLabel: "Besok, 23:59",
    color: "#4F46E5",
    status: "due",
  },
  {
    id: 2,
    title: "Esai Analisis Puisi",
    subject: "Bahasa Indonesia",
    dueLabel: "3 hari lagi",
    color: "#0891B2",
    status: "due",
  },
  {
    id: 3,
    title: "Laporan Gerak Lurus",
    subject: "Fisika Dasar",
    dueLabel: "Selesai",
    color: "#059669",
    status: "done",
  },
  {
    id: 4,
    title: "Analisis Data Statistik",
    subject: "Matematika Lanjutan",
    dueLabel: "Selesai",
    color: "#4F46E5",
    status: "done",
  },
];

// function BooksIllustration() {
//   return (
//     <Box
//       component="svg"
//       viewBox="0 0 220 170"
//       sx={{ width: { xs: 140, md: 190 }, height: "auto", flexShrink: 0 }}
//     >
//       <ellipse cx="110" cy="150" rx="85" ry="14" fill="rgba(0,0,0,0.08)" />
//       <g transform="translate(20,70)">
//         <rect x="0" y="30" width="150" height="30" rx="6" fill="#3346C4" />
//         <rect x="10" y="6" width="130" height="30" rx="6" fill="#F76B9C" />
//         <rect x="24" y="-18" width="102" height="30" rx="6" fill="#FDE68A" />
//         <circle cx="150" cy="-4" r="7" fill="#60A5FA" />
//         <circle cx="10" cy="-10" r="5" fill="#F472B6" />
//       </g>
//     </Box>
//   );
// }

function CalendarIllustration() {
  const today = new Date();

  const dayNumber = today.getDate();

  const fullDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 220 220"
        sx={{
          width: { xs: 140, md: 190 },
          height: "auto",
        }}
      >
        {/* Background */}
        {/* <rect
          x="20"
          y="20"
          width="180"
          height="180"
          rx="28"
          fill="#C8E04A"
        /> */}

        {/* Calendar */}
        <g transform="translate(52,42)">
          {/* Body */}
          <rect
            x="0"
            y="28"
            width="116"
            height="112"
            rx="18"
            fill="#FFFFFF"
          />

          {/* Header */}
          <path
            d="M0 28
               Q0 0 24 0
               H92
               Q116 0 116 28
               V42
               H0
               Z"
            fill="#F56AA2"
          />

          {/* Rings */}
          <rect
            x="22"
            y="-8"
            width="8"
            height="30"
            rx="4"
            fill="#4A352A"
          />

          <rect
            x="86"
            y="-8"
            width="8"
            height="30"
            rx="4"
            fill="#4A352A"
          />

          {/* Date */}
          <text
            x="58"
            y="108"
            textAnchor="middle"
            fontSize="58"
            fontWeight="700"
            fill="#4A352A"
            fontFamily="Inter, sans-serif"
          >
            {dayNumber}
          </text>
        </g>
      </Box>
    </Box>
  );
}

export default function StudentPage() {
  const router = useRouter();

  const [classes, setClasses] = useState<any[]>([]);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [joinOpen, setJoinOpen] = useState(false);

  async function loadData() {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await getMyClasses(token);
    console.log(data);
    setClasses(data);

    // Belum ada endpoint "total tugas semua kelas" langsung, jadi kita
    // loop tiap kelas yang diikuti terus jumlahin assignment-nya satu-satu
    // pakai endpoint yang sama kayak di StudentClassPage.
    try {
      const counts = await Promise.all(
        (data ?? []).map(async (cls: any) => {
          const res = await fetch(
            `${API_URL}/assignments/student/${cls.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const assignmentData = await res.json();

          return Array.isArray(assignmentData) ? assignmentData.length : 0;
        })
      );

      setTotalAssignments(counts.reduce((sum, n) => sum + n, 0));
    } catch (err) {
      console.error("Gagal menghitung total tugas:", err);
      setTotalAssignments(0);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // // Tanggal hari ini beneran (bukan hardcode), format kaya "12 Mei 2022, Jumat"
  // const today = new Date().toLocaleDateString("id-ID", {
  //   weekday: "long",
  //   day: "numeric",
  //   month: "long",
  //   year: "numeric",
  // });

  return (
    <>
      <StudentSidebar />
      {/* <Navbar /> */}

      {/* Background lembut di belakang panel putih, biar transisi dari
          sidebar ke konten kerasa nyambung/ngambang, bukan nempel rata. */}
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#EEF0FB",
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
          {/* Search bar + tanggal, gantiin fungsi Navbar yang dimatikan */}
          <Stack
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 3,
            }}
          >            
          {/* <CalendarIllustration /> */}
          </Stack>

          {/* Banner selamat datang — nama & jumlah tugas masih hardcode,
              belum ada endpoint profil siswa / ringkasan tugas. */}
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              background: "linear-gradient(120deg, #EEF1FF 0%, #E3E7FF 55%, #F3E8FF 100%)",
              boxShadow: "none",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack
                sx={{
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", md: "center" },
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ color: "#20243D", mb: 0.7 }}
                  >
                    {/* TODO: ganti dengan nama siswa asli dari backend */}
                    Selamat datang kembali, Rafi Akbar!
                  </Typography>

                  <Typography sx={{ color: "#5B6178", maxWidth: 440, lineHeight: 1.7 }}>
                    Kamu punya <b>2 tugas</b> yang perlu dikumpulkan. Yuk cek
                    kelasmu dan tetap jaga progress belajarmu.
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() => setJoinOpen(true)}
                    sx={{
                      mt: 2.5,
                      bgcolor: "#3346C4",
                      color: "white",
                      textTransform: "none",
                      borderRadius: 999,
                      px: 3,
                      py: 1.1,
                      fontWeight: 700,
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#26339C", boxShadow: "none" },
                    }}
                  >
                    + Gabung Kelas
                  </Button>
                </Box>
                <CalendarIllustration />

                {/* <BooksIllustration /> */}
              </Stack>
            </CardContent>
          </Card>

          {/* Stat cards: "Kelas Aktif" & "Total Tugas" pakai data asli,
              2 lainnya masih placeholder sampai endpoint-nya ada. */}
          <Grid container spacing={2.5} mb={4}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: 2, height: "100%", boxShadow: "none", border: "1px solid #EEF0F6" }}>
                <CardContent>
                  <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography color="text.secondary" fontSize={14}>
                      Kelas Aktif
                    </Typography>
                    <Box
                      sx={{
                        width: 32, height: 32, borderRadius: 1.25,
                        bgcolor: "#EEF2FF", color: "#3346C4",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <MenuBookRoundedIcon fontSize="small" />
                    </Box>
                  </Stack>
                  <Typography variant="h4" fontWeight={800} mt={2}>
                    {classes.length}
                  </Typography>
                  <Typography color="text.secondary" fontSize={13} mt={0.5}>
                    semester ini
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: 2, height: "100%", boxShadow: "none", border: "1px solid #EEF0F6" }}>
                <CardContent>
                  <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography color="text.secondary" fontSize={14}>
                      Total Tugas
                    </Typography>
                    <Box
                      sx={{
                        width: 32, height: 32, borderRadius: 1.25,
                        bgcolor: "#ECFDF5", color: "#059669",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <AssignmentRoundedIcon fontSize="small" />
                    </Box>
                  </Stack>
                  <Typography variant="h4" fontWeight={800} mt={2}>
                    {totalAssignments}
                  </Typography>
                  <Typography color="text.secondary" fontSize={13} mt={0.5}>
                    dari semua kelas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: 2, height: "100%", boxShadow: "none", border: "1px solid #EEF0F6" }}>
                <CardContent>
                  <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography color="text.secondary" fontSize={14}>
                      Perlu Dikumpulkan
                    </Typography>
                    <Box
                      sx={{
                        width: 32, height: 32, borderRadius: 1.25,
                        bgcolor: "#FFF7ED", color: "#C2410C",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <AccessTimeRoundedIcon fontSize="small" />
                    </Box>
                  </Stack>
                  {/* TODO: hitung dari endpoint tugas asli */}
                  <Typography variant="h4" fontWeight={800} mt={2}>
                    2
                  </Typography>
                  <Typography color="text.secondary" fontSize={13} mt={0.5}>
                    segera selesaikan
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: 2, height: "100%", boxShadow: "none", border: "1px solid #EEF0F6" }}>
                <CardContent>
                  <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography color="text.secondary" fontSize={14}>
                      Skor Integritas
                    </Typography>
                    <Box
                      sx={{
                        width: 32, height: 32, borderRadius: 1.25,
                        bgcolor: "#ECFDF5", color: "#059669",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <VerifiedUserRoundedIcon fontSize="small" />
                    </Box>
                  </Stack>
                  {/* TODO: ambil dari endpoint skor integritas AI */}
                  <Typography variant="h4" fontWeight={800} mt={2} sx={{ color: "#059669" }}>
                    98%
                  </Typography>
                  <Typography color="text.secondary" fontSize={13} mt={0.5}>
                    rata-rata semua tugas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* "Classes" — kartu gradient horizontal kayak referensi.
              Nama kelas & id dari data asli, sisanya (guru, files, avatar,
              jumlah siswa) masih dummy dari classDemoMeta. */}
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Classes
            </Typography>
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                color: "#3346C4",
                fontWeight: 600,
              }}
              onClick={() => router.push("/student/my-classes")}
            >
              <Typography fontWeight={600} fontSize={14} color="inherit">
                View All
              </Typography>
              <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
            </Stack>
          </Stack>

          {classes.length === 0 ? (
            <Card sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid #EEF0F6", mb: 4 }}>
              <CardContent>
                <Typography align="center" color="text.secondary">
                  You haven&apos;t joined any classes.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2.5} mb={4}>
              {classes.map((item, index) => {
                const meta = classDemoMeta[index % classDemoMeta.length];

                return (
                  <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Card
                      sx={{
                        borderRadius: 1,
                        background: meta.gradient,
                        color: "white",
                        cursor: "pointer",
                        boxShadow: "none",
                        transition: ".2s",
                        "&:hover": { transform: "translateY(-3px)" },
                      }}
                      onClick={() => router.push(`/student/class/${item.id}`)}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography fontWeight={700} fontSize={16} mb={1.5}>
                          {item.class_name}
                        </Typography>

                        <AvatarGroup
                          max={4}
                          sx={{
                            justifyContent: "flex-end",
                            flexDirection: "row-reverse",
                            mb: 2,
                            "& .MuiAvatar-root": {
                              width: 26,
                              height: 26,
                              fontSize: 11,
                              border: "2px solid rgba(255,255,255,0.4)",
                            },
                          }}
                        >
                          {meta.avatarColors.map((c, i) => (
                            <Avatar key={i} sx={{ bgcolor: c }}> </Avatar>
                          ))}
                          {meta.extraStudents > 0 && (
                            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)", fontSize: 11 }}>
                              +{meta.extraStudents}
                            </Avatar>
                          )}
                        </AvatarGroup>

                        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.7, mb: 0.8, opacity: 0.9 }}>
                          <FolderRoundedIcon sx={{ fontSize: 16 }} />
                          <Typography fontSize={13}>{meta.files} Files</Typography>
                        </Stack>

                        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.7, opacity: 0.9 }}>
                          <PersonRoundedIcon sx={{ fontSize: 16 }} />
                          <Typography fontSize={13}>Teacher: {meta.teacher}</Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Dua kolom: kiri detail kelas (data asli, list biasa),
              kanan "Tugas Terkini" (masih statis, belum ada endpoint). */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>

            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Tugas Terkini
                </Typography>
                <Typography
                  color="primary"
                  fontWeight={600}
                  fontSize={14}
                  sx={{ cursor: "pointer" }}
                  onClick={() => router.push("/student/assignments")}
                >
                  Semua Tugas
                </Typography>
              </Stack>

              <Card sx={{ borderRadius: 1, boxShadow: "none", border: "1px solid #EEF0F6" }}>
                <CardContent sx={{ p: 0 }}>
                  <Stack divider={<Box sx={{ borderBottom: "1px solid #EEF0F3" }} />}>
                    {recentAssignments.map((task) => (
                      <Stack
                        key={task.id}
                        sx={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                          p: 2,
                        }}
                      >
                        <Stack sx={{ flexDirection: "row", gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 8, height: 8, borderRadius: "50%",
                              bgcolor: task.color, mt: 0.8, flexShrink: 0,
                            }}
                          />
                          <Box>
                            <Typography fontWeight={700} fontSize={14.5}>
                              {task.title}
                            </Typography>
                            <Typography color="text.secondary" fontSize={13}>
                              {task.subject}
                            </Typography>
                          </Box>
                        </Stack>

                        {task.status === "done" ? (
                          <Chip
                            size="small"
                            icon={<CheckCircleRoundedIcon sx={{ fontSize: 14, color: "#059669 !important" }} />}
                            label="Selesai"
                            sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 600, flexShrink: 0 }}
                          />
                        ) : (
                          <Chip
                            size="small"
                            icon={<AccessTimeRoundedIcon sx={{ fontSize: 14, color: "#D97706 !important" }} />}
                            label={task.dueLabel}
                            sx={{ bgcolor: "#FFF7ED", color: "#D97706", fontWeight: 600, flexShrink: 0 }}
                          />
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card
                sx={{
                  mt: 2.5,
                  borderRadius: 1,
                  border: "1px solid #E0E7FF",
                  bgcolor: "#F5F5FF",
                  boxShadow: "none",
                }}
              >
                <CardContent>
                  <Stack sx={{ flexDirection: "row", gap: 1.5, alignItems: "flex-start" }}>
                    <AutoAwesomeRoundedIcon color="primary" />
                    <Box>
                      <Typography fontWeight={700} color="primary">
                        Pemeriksaan Integritas AI
                      </Typography>
                      <Typography color="text.secondary" fontSize={13} mt={0.5}>
                        Setiap tugas yang kamu kumpulkan akan diperiksa secara
                        otomatis untuk memastikan orisinalitas karyamu.
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <JoinClassModal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        onJoined={loadData}
      />
    </>
  );
}