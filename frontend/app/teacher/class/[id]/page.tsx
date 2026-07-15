"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Fraunces, Poppins } from "next/font/google";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Stack,
  Grid,
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

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Palet warna tema premium kesukaan kamu
const ink = "#0B2545";
const steel = "#2C6E9E";
const slate = "#5B6B82";
const line = "#D9E3F0";

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
}

const demoAssignmentMeta = [
  { status: "Aktif", statusColor: "#059669", submitted: 18, total: 24, aiFlagged: 3 },
  { status: "Ditutup", statusColor: "#64748B", submitted: 24, total: 24, aiFlagged: 1 },
  { status: "Aktif", statusColor: "#059669", submitted: 5, total: 24, aiFlagged: 0 },
  { status: "Aktif", statusColor: "#059669", submitted: 12, total: 24, aiFlagged: 4 },
  { status: "Ditutup", statusColor: "#64748B", submitted: 20, total: 20, aiFlagged: 2 },
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

      // Backend API tetap dipanggil normal tanpa diubah strukturnya
      const classData = await getClassDetail(token, Number(params.id));
      setClassroom(classData);

      const assignmentData = await getAssignments(token, Number(params.id));
      
      // Jika data dari backend kosong/sedikit, kita gabungkan dengan data dummy agar UI terlihat ramai
      if (!assignmentData || assignmentData.length === 0) {
        setAssignments([
          {
            id: 101,
            title: "Database Normalization (1NF to 3NF)",
            description: "Pahami struktur anomali data dan lakukan normalisasi tabel hingga bentuk ke-tiga.",
            deadline: "2026-07-20T23:59:50.000Z",
          },
          {
            id: 102,
            title: "Entity Relationship Diagram Design",
            description: "Buat rancangan ERD sistem manajemen rumah sakit lengkap dengan kardinalitas entitas.",
            deadline: "2026-07-15T23:59:50.000Z",
          },
          {
            id: 103,
            title: "Complex SQL Join Queries",
            description: "Latihan query manipulasi data menggunakan multijoin clauses, subqueries, dan agregasi data.",
            deadline: "2026-07-25T23:59:50.000Z",
          },
        ]);
      } else {
        setAssignments(assignmentData);
      }
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
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Typography className={poppins.className} sx={{ color: slate }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Sidebar />
      <Navbar/>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#EAF4FF",
          ml: { xs: 0, md: "260px" },
          p: { xs: 1.5, md: 3 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          className={poppins.className}
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            minHeight: "calc(100vh - 48px)",
            boxShadow: "0 20px 45px -20px rgba(51,70,196,0.15)",
            p: { xs: 2.5, md: 4 },
            flexGrow: 1,
          }}
        >
          <Container maxWidth="xl" disableGutters>
            {/* Navigasi Kembali */}
            <Typography
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: slate,
                fontSize: 14,
                cursor: "pointer",
                mb: 2,
                fontWeight: 500,
                "&:hover": { color: ink },
              }}
              onClick={() => router.push("/teacher")}
            >
              <ArrowBackRoundedIcon fontSize="small" />
              Kembali ke Daftar Kelas
            </Typography>

            {/* Judul & Aksi Utama */}
            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                borderBottom: `1px solid ${line}`,
                pb: 3,
              }}
            >
              <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#E6F1FB",
                    color: steel,
                    width: 54,
                    height: 54,
                    fontWeight: 700,
                    fontSize: 22,
                    border: `1px solid ${line}`,
                  }}
                >
                  {classroom.class_name?.charAt(0) ?? "?"}
                </Avatar>

                <Box>
                  <Typography
                    className={fraunces.className}
                    sx={{ fontSize: { xs: 24, md: 28 }, fontWeight: 600, color: ink, fontStyle: "italic" }}
                  >
                    {classroom.class_name}
                  </Typography>
                  <Typography sx={{ color: slate, fontSize: 14, mt: 0.5 }}>
                    {classroom.description || "Tidak ada deskripsi kelas."}
                  </Typography>
                </Box>
              </Stack>

              <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
                <Chip
                  label={copied ? "Disalin!" : `Kode: ${classroom.class_code}`}
                  onClick={copyClassCode}
                  icon={<ContentCopyRoundedIcon sx={{ fontSize: 14, color: `${steel} !important` }} />}
                  sx={{
                    bgcolor: "#F8FAFC",
                    color: ink,
                    fontWeight: 600,
                    border: `1px solid ${line}`,
                    borderRadius: 1.5,
                    cursor: "pointer",
                    px: 1,
                    py: 2,
                    "&:hover": { bgcolor: "#EEF5FF", borderColor: steel },
                  }}
                />

                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: ink,
                    boxShadow: "none",
                    px: 3,
                    py: 1,
                    "&:hover": { bgcolor: "#0A1F3D", boxShadow: "none" },
                  }}
                  onClick={() => router.push(`/teacher/class/${params.id}/create-assignment`)}
                >
                  Buat Tugas
                </Button>
              </Stack>
            </Stack>

            {/* Statistik Row Terkondisi */}
            <Stack
              sx={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: { xs: "flex-start", sm: "space-between" },
                alignItems: "center",
                gap: 3,
                mt: 3,
                mb: 4,
                p: 2.5,
                borderRadius: 2,
                bgcolor: "#F8FAFC",
                border: `1px solid ${line}`,
              }}
            >
              <StatItem
                icon={<GroupsRoundedIcon fontSize="small" />}
                iconColor="#2C6E9E"
                iconBg="#E6F1FB"
                label="Total Siswa"
                value="8 Murid"
              />
              <StatItem
                icon={<AssignmentRoundedIcon fontSize="small" />}
                iconColor="#2C6E9E"
                iconBg="#E6F1FB"
                label="Tugas Aktif"
                value={`${assignments.length} Tugas`}
              />
              <StatItem
                icon={<ChecklistRtlRoundedIcon fontSize="small" />}
                iconColor="#059669"
                iconBg="#ECFDF5"
                label="Total Pengumpulan"
                value="47 Berkas"
              />
              <StatItem
                icon={<WarningAmberRoundedIcon fontSize="small" />}
                iconColor="#D97706"
                iconBg="#FFF7ED"
                label="Terindikasi AI"
                value="2 Kasus"
              />
              <StatItem
                icon={<VerifiedUserRoundedIcon fontSize="small" />}
                iconColor="#059669"
                iconBg="#ECFDF5"
                label="Rata Integritas"
                value="90%"
                valueColor="#059669"
              />
            </Stack>

            {/* Area Pengaturan Tab Menu */}
            <Stack sx={{ flexDirection: "row", gap: 4, borderBottom: `1px solid ${line}`, mb: 3.5 }}>
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <Stack
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                      pb: 1.5,
                      cursor: "pointer",
                      color: active ? steel : slate,
                      borderBottom: active ? "2.5px solid" : "2.5px solid transparent",
                      borderColor: active ? steel : "transparent",
                      fontWeight: active ? 700 : 500,
                      transition: "all 0.2s",
                    }}
                  >
                    {tab.icon}
                    <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: 14.5, color: "inherit" }}>
                      {tab.label}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>

            {/* Isian Konten Tiap Tab */}
            <Box sx={{ pb: 4 }}>
              {activeTab === "tugas" && (
                <Stack sx={{ gap: 2.5 }}>
                  {assignments.map((item, index) => {
                    const meta = demoAssignmentMeta[index % demoAssignmentMeta.length];
                    const percent = Math.round((meta.submitted / meta.total) * 100);

                    return (
                      <Card
                        key={item.id}
                        sx={{
                          borderRadius: 2,
                          boxShadow: "none",
                          border: `1px solid ${line}`,
                          cursor: "pointer",
                          transition: ".2s",
                          "&:hover": {
                            borderColor: steel,
                            boxShadow: "0 10px 25px -5px rgba(51,70,196,0.08)",
                          },
                        }}
                        onClick={() => router.push(`/teacher/assignment/${item.id}`)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                            <Stack sx={{ flexDirection: "row", gap: 2 }}>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 1.5,
                                  bgcolor: "#F0F4F8",
                                  color: steel,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  border: `1px solid ${line}`,
                                }}
                              >
                                <DescriptionRoundedIcon fontSize="small" />
                              </Box>

                              <Box>
                                <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                                  <Typography sx={{ fontWeight: 700, fontSize: 16.5, color: ink }}>
                                    {item.title}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    label={meta.status}
                                    sx={{
                                      bgcolor: `${meta.statusColor}1A`,
                                      color: meta.statusColor,
                                      fontWeight: 600,
                                      fontSize: 12,
                                      height: 22,
                                    }}
                                  />
                                </Stack>
                                <Typography sx={{ color: slate, fontSize: 14, mt: 0.5, lineHeight: 1.6 }}>
                                  {item.description}
                                </Typography>
                              </Box>
                            </Stack>
                          </Stack>

                          {/* Bagian Progress Bar Pengumpulan */}
                          <Box sx={{ mt: 3, maxWidth: 450 }}>
                            <Stack sx={{ flexDirection: "row", justifyContent: "space-between", mb: 0.8 }}>
                              <Typography sx={{ fontSize: 13, color: slate }}>
                                {meta.submitted} dari {meta.total} murid mengumpulkan
                              </Typography>
                              <Typography sx={{ fontSize: 13, fontWeight: 700, color: ink }}>
                                {percent}%
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={percent}
                              sx={{
                                height: 6,
                                borderRadius: 999,
                                bgcolor: "#EEF2F6",
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 999,
                                  bgcolor: percent >= 100 ? "#059669" : steel,
                                },
                              }}
                            />
                          </Box>

                          <Divider sx={{ my: 2, borderColor: line }} />

                          {/* Atribut Kaki Kartu Tugas */}
                          <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.8, color: slate }}>
                              <CalendarTodayRoundedIcon sx={{ fontSize: 14 }} />
                              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                                Batas Waktu:{" "}
                                {new Date(item.deadline).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </Typography>
                            </Stack>

                            {meta.aiFlagged > 0 && (
                              <Chip
                                size="small"
                                icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 13, color: "#D97706 !important" }} />}
                                label={`${meta.aiFlagged} Terindikasi AI`}
                                sx={{ bgcolor: "#FFF7ED", color: "#D97706", fontWeight: 600, fontSize: 12 }}
                              />
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              )}

              {activeTab === "siswa" && (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
    {/* Judul kecil & Counter total siswa */}
    <Typography sx={{ color: ink, fontWeight: 700, fontSize: 16, mb: 0.5 }}>
      Siswa Terdaftar ({
        [
          "Dinda Isyariani",
          "Kevin Wijaya",
          "Siti Rahma",
          "Ahmad Fauzi",
          "Galvin",
          "Anggota Kelompok 4 A",
          "Anggota Kelompok 4 B",
          "Muhammad Rizky"
        ].length
      })
    </Typography>

    {/* List Siswa Dummy */}
    {[
      { id: 1, name: "Dinda Isyariani", role: "Mahasiswa", nim: "2406012XXXXXX" },
      { id: 2, name: "Kevin Wijaya", role: "Mahasiswa", nim: "2406012XXXXXX" },
      { id: 3, name: "Siti Rahma", role: "Mahasiswa", nim: "2406012XXXXXX" },
      { id: 4, name: "Ahmad Fauzi", role: "Mahasiswa", nim: "2406012XXXXXX" },
      { id: 5, name: "Galvin", role: "Mahasiswa", nim: "2406012XXXXXX" },
      { id: 6, name: "Anggota Kelompok 4 A", role: "Mahasiswa", nim: "2406012XXXXXX" },
      { id: 7, name: "Anggota Kelompok 4 B", role: "Mahasiswa", nim: "2406012XXXXXX" },
      { id: 8, name: "Muhammad Rizky", role: "Mahasiswa", nim: "2406012XXXXXX" },
    ].map((siswa) => (
      <Card
        key={siswa.id}
        sx={{
          borderRadius: 2,
          boxShadow: "none",
          border: `1px solid ${line}`,
          transition: ".2s",
          "&:hover": {
            borderColor: steel,
            boxShadow: "0 6px 16px rgba(51,70,196,0.05)",
          },
        }}
      >
        <CardContent sx={{ p: "16px 24px !important" }}>
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Profil & Detail Identitas */}
            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "#E6F1FB",
                  color: steel,
                  fontWeight: 700,
                  fontSize: 15,
                  width: 40,
                  height: 40,
                  border: `1px solid ${line}`,
                }}
              >
                {siswa.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: ink }}>
                  {siswa.name}
                </Typography>
                <Typography sx={{ color: slate, fontSize: 12.5, mt: 0.2 }}>
                  NIM: {siswa.nim}
                </Typography>
              </Box>
            </Stack>

            {/* Label Status / Peran */}
            <Chip
              label={siswa.role}
              size="small"
              sx={{
                bgcolor: "#F8FAFC",
                color: slate,
                fontWeight: 600,
                fontSize: 12,
                border: `1px solid ${line}`,
                borderRadius: 1,
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    ))}
  </Box>
)}

              {activeTab === "analitik" && (

  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    
    {/* Baris Ringkasan Kartu Grafik - Menggunakan Flexbox Murni */}
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" }, 
        gap: 3, 
        width: "100%" 
      }}
    >

      
      {/* 1. Grafik Batang Mini - Distribusi Integritas */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Card sx={{ borderRadius: 2, boxShadow: "none", border: `1px solid ${line}`, height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ color: ink, fontWeight: 700, fontSize: 16, mb: 2.5 }}>
              Status Integritas Mahasiswa
            </Typography>
            
            <Stack sx={{ gap: 2 }}>
              {[
                { label: "Excellent (Skor 90-100)", count: 5, color: "#22C55E", total: 8 },
                { label: "Good (Skor 80-89)", count: 2, color: "#3B82F6", total: 8 },
                { label: "Needs Review (Skor <70)", count: 1, color: "#EF4444", total: 8 },
              ].map((item, idx) => (
                <Box key={idx}>
                  <Stack sx={{ flexDirection: "row", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography sx={{ fontSize: 13, color: slate, fontWeight: 500 }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: ink }}>{item.count} Mhs</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={(item.count / item.total) * 100} 
                    sx={{
                      height: 8,
                      borderRadius: 2,
                      bgcolor: "#F1F5F9",
                      "& .MuiLinearProgress-bar": { bgcolor: item.color, borderRadius: 2 }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* 2. Tren Nilai Tugas Terakhir */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Card sx={{ borderRadius: 2, boxShadow: "none", border: `1px solid ${line}`, height: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ color: ink, fontWeight: 700, fontSize: 16, mb: 2.5 }}>
              Rata-rata Nilai Kelas (3 Tugas Terakhir)
            </Typography>

            {/* Diagram Batang Murni Pakai CSS Flex & Box */}
            <Stack sx={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", height: 130, pt: 2, pb: 1 }}>
              {[
                { tugas: "Tugas ERD", score: 85 },
                { tugas: "Tugas Normalisasi", score: 92 },
                { tugas: "Tugas SQL Join", score: 78 },
              ].map((bar, idx) => (
                <Stack key={idx} sx={{ alignItems: "center", gap: 1, width: "30%" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: steel }}>{bar.score}</Typography>
                  <Box 
                    sx={{ 
                      width: "100%", 
                      height: `${bar.score}%`, 
                      maxHeight: 90,
                      bgcolor: idx === 1 ? steel : "#CBD5E1", 
                      borderRadius: "4px 4px 0 0",
                      transition: "0.3s",
                      "&:hover": { bgcolor: ink }
                    }} 
                  />
                  <Typography sx={{ fontSize: 11, color: slate, textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", width: "100%" }}>
                    {bar.tugas}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

    </Box>
    <Card sx={{ borderRadius: 2, boxShadow: "none", border: `1px solid ${line}` }}>
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ color: ink, fontWeight: 700, fontSize: 16, mb: 2 }}>
          Anomali Log Aktivitas Terdeteksi
        </Typography>
        {/* ... isi list log ... */}
      </CardContent>
    </Card>

    {/* 3. Log Indikasi Pelanggaran AI / Tab Terbanyak */}
    <Card sx={{ borderRadius: 2, boxShadow: "none", border: `1px solid ${line}` }}>
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ color: ink, fontWeight: 700, fontSize: 16, mb: 2 }}>
          Anomali Log Aktivitas Terdeteksi
        </Typography>
        
        <Stack sx={{ gap: 1.5 }}>
          {[
            { tipe: "Copy-Paste Massal", detail: "Mendeteksi kesamaan teks >85% antar file mahasiswa.", count: "3 Mahasiswa", color: "#F59E0B" },
            { tipe: "Tab Switching Berlebih", detail: "Keluar dari tab ujian/tugas lebih dari 10 kali.", count: "2 Mahasiswa", color: "#F59E0B" },
            { tipe: "Teks Hasil AI Generator", detail: "Struktur kalimat 100% identik dengan pola LLM.", count: "2 Mahasiswa", color: "#EF4444" },
          ].map((log, idx) => (
            <Stack 
              key={idx} 
              sx={{ 
                flexDirection: { xs: "column", sm: "row" }, 
                justifyContent: "space-between", 
                alignItems: { xs: "flex-start", sm: "center" },
                p: 2, 
                bgcolor: "#F8FAFC", 
                borderRadius: 1.5, 
                border: `1px solid ${line}`, 
                gap: 1 
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: log.color }}>
                  {log.tipe}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: slate, mt: 0.2 }}>
                  {log.detail}
                </Typography>
              </Box>
              <Chip 
                label={log.count} 
                size="small" 
                sx={{ bgcolor: "white", border: `1px solid ${line}`, fontWeight: 600, color: ink, fontSize: 12 }} 
              />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>

  </Box>
)}
            </Box>
          </Container>
        </Box>
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
    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.5 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1.5,
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
        <Typography sx={{ fontSize: 12.5, color: slate, fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography sx={{ color: valueColor || ink, fontWeight: 700, fontSize: 16, mt: 0.1 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}