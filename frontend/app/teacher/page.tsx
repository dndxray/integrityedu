"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fraunces, IBM_Plex_Mono, Poppins } from "next/font/google";
import {
  Alert,
  Box,
  Button,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface ClassData {
  id: number;
  class_name: string;
  class_code: string;
  description: string;
}

// Font pairing: Fraunces (serif hangat, buat headline/personality),
// IBM Plex Mono (buat angka/kode/timestamp — kesan buku besar/audit-trail,
// cocok sama tema "integrity"), Poppins dipertahankan (sama kayak sidebar).
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Token warna: navy tinta + biru baja + aksen kuningan/merah muted —
// sengaja dijauhin dari kombinasi oranye-terracotta/hijau-neon yang
// klise di desain ber-AI.
const ink = "#0B2545";
const steel = "#2C6E9E";
const slate = "#5B6B82";
const line = "#D9E3F0";
const brass = "#B8862B";
const danger = "#B23B3B";

// TODO: field-field ini belum ada endpoint-nya di backend (jumlah tugas,
// jumlah siswa, alert integritas, skor rata-rata). Hardcode dulu biar
// dashboard-nya nggak kosong melompong, gampang disambung nanti.
const placeholderStats = {
  assignments: "4",
  students: "15",
  aiAlerts: "5",
};

const integrityAlerts = [
  {
    id: 1,
    student: "Ahmad F.",
    assignment: "Essay Tugas 3",
    similarity: 92,
    time: "2 jam lalu",
  },
  {
    id: 2,
    student: "Siti N.",
    assignment: "Laporan Praktikum",
    similarity: 78,
    time: "Kemarin",
  },
  {
    id: 3,
    student: "Budi S.",
    assignment: "Kuis Bab 4",
    similarity: 61,
    time: "2 hari lalu",
  },
];

function severityColor(similarity: number) {
  if (similarity >= 85) return danger;
  if (similarity >= 70) return brass;
  return slate;
}

// Tile statistik gaya "kartu katalog" — sudut asimetris (bukan pill/oval
// seragam), eyebrow bernomor mono, garis aksen tipis di bawah angka.
function StatTile({
  index,
  label,
  value,
  accent,
  caption,
}: {
  index: string;
  label: string;
  value: React.ReactNode;
  accent: string;
  caption: string;
}) {
  return (
    <Box
      sx={{
        bgcolor: "white",
        border: `1px solid ${line}`,
        borderRadius: "4px 16px 4px 4px",
        p: 2.5,
        transition: "transform .18s ease, box-shadow .18s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 14px 28px -16px rgba(11,37,69,0.35)",
        },
      }}
    >
      {/* <Typography
        className={plexMono.className}
        sx={{ fontSize: 11, letterSpacing: 1.2, color: slate, mb: 1.2 }}
      >
        {index} · {label.toUpperCase()}
      </Typography> */}
      <Typography
        className={plexMono.className}
        sx={{ fontSize: {xs:24,md:32}, fontWeight: 600, color: ink, lineHeight: 1 }}
      >
        {value}
      </Typography>
      <Box sx={{ width: 30, height: 3, bgcolor: accent, borderRadius: 1, my: 1.3 }} />
      <Typography sx={{ fontSize: 12.5, color: slate }}>{caption}</Typography>
    </Box>
  );
}

// Signature element: badge "stempel" lingkaran dashed nunjukin skor
// integritas rata-rata kelas — motif yang langsung nyambung ke inti produk
// (academic integrity), bukan ikon generik di lingkaran warna flat.
// Donut "readiness" style — nunjukin skor integritas rata-rata kelas,
// segmennya proporsional ke 3 kategori (aman/perlu ditinjau/flagged) biar
// nggak sekadar angka polos.
function IntegrityDonut({
  score,
  segments,
}: {
  score: number;
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let cursor = 0;
  const stops = segments
    .map((s) => {
      const start = (cursor / total) * 100;
      cursor += s.value;
      const end = (cursor / total) * 100;
      return `${s.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <Box
      sx={{
        width: 112,
        height: 112,
        borderRadius: "50%",
        background: `conic-gradient(${stops})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 82,
          height: 82,
          borderRadius: "50%",
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography className={plexMono.className} sx={{ fontSize: 22, fontWeight: 600, color: ink }}>
          {score}%
        </Typography>
        <Typography className={plexMono.className} sx={{ fontSize: 8, letterSpacing: 1.4, color: steel }}>
          SCORE
        </Typography>
      </Box>
    </Box>
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

        const response = await fetch(`${API_URL}/classes/my`, {
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

  const todayLabel = new Date().toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Sidebar />
      <Navbar/>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#EAF4FF",
          ml: { xs: 0, md: "260px" },
          p: { xs: 3, sm : 2, md: 3 },
        }}
      >
        <Box
          className={poppins.className}
          sx={{
            bgcolor: "white",
            borderRadius: { xs:2, md:3},
            minHeight: { md: "calc(100vh - 48px)" },
            boxShadow: "0 20px 45px -20px rgba(51,70,196,0.15)",
            p: { xs: 2.5, md: 4 },
          }}
        >
          {/* Banner sapaan biru — nama guru masih hardcode, belum ada
              endpoint profil guru. Ilustrasi & jam real-time (bukan hardcode). */}
          <Box
            sx={{
              borderRadius: 2,
              background: `linear-gradient(135deg, #14396B 0%, ${steel} 65%, #3F8FC4 100%)`,
              color: "white",
              p: { xs: 3, md: 6 },
              mb: 3.5,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                gap: 2,
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                  className={fraunces.className}
                  sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 600, fontStyle: "italic" }}
                >
                  {/* TODO: ganti dengan nama guru asli dari backend */}
                  Halo, Bu Guru!
                </Typography>
                <Typography sx={{ opacity: 0.85, mt: 0.5 }}>
                  Semoga hari mengajarmu menyenangkan.
                </Typography>
              </Box>

              {/* <TeacherIllustration /> */}
            </Box>
          </Box>

          {/* Stat tiles */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2.5,
              mb: 3,
            }}
          >
            <StatTile
              index="01"
              label="Classes"
              value={classes.length}
              accent={steel}
              caption="Kelas yang kamu ampu"
            />
            <StatTile
              index="02"
              label="Assignments"
              value={placeholderStats.assignments}
              accent="#3D7A5C"
              caption="Total tugas aktif"
            />
            <StatTile
              index="03"
              label="Students"
              value={placeholderStats.students}
              accent={brass}
              caption="Murid terdaftar"
            />
            <StatTile
              index="04"
              label="AI Alerts"
              value={placeholderStats.aiAlerts}
              accent={danger}
              caption="Perlu ditinjau"
            />
          </Box>

          {/* Panel donut "readiness" + progress completion per kelas —
              gaya "My Scheduled Events" / "My Plans Done" di referensi.
              Semua angkanya hardcode (TODO), belum ada endpoint agregatnya. */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2.5,
              mb: 3,
            }}
          >
            <Box sx={{ border: `1px solid ${line}`, borderRadius: 2, p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, color: ink, mb: 2 }}>
                Class Snapshot
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                {/* TODO: proporsi ini hardcode, ganti pas ada endpoint asli */}
                <IntegrityDonut
                  score={98}
                  segments={[
                    { label: "Aman", value: 82, color: "#0cea7b" },
                    { label: "Perlu ditinjau", value: 12, color: "#f6a523" },
                    { label: "Flagged", value: 6, color: "#dc0808" },
                  ]}
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[
                    { label: "Aman", value: "82%", color: "#0cea7b" },
                    { label: "Perlu ditinjau", value: "12%", color: "#f6a523" },
                    { label: "Flagged", value: "6%", color: "#dc0808" },
                  ].map((row) => (
                    <Box key={row.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: row.color }} />
                      <Typography sx={{ fontSize: 13, color: slate }}>{row.label}</Typography>
                      <Typography className={plexMono.className} sx={{ fontSize: 13, color: ink, ml: "auto", fontWeight: 600 }}>
                        {row.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box sx={{ border: `1px solid ${line}`, borderRadius: 2, p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, color: ink, mb: 2 }}>
                Completion by Class
              </Typography>
              {/* TODO: nama kelas dari data asli, persentase-nya hardcode
                  (belum ada endpoint progress tugas per kelas). */}
              {(classes.length > 0
                ? classes.slice(0, 3)
                : [
                    { id: "a", class_name: "Kelas A" },
                    { id: "b", class_name: "Kelas B" },
                    { id: "c", class_name: "Kelas C" },
                  ]
              ).map((cls, i) => {
                const pct = [78, 54, 33][i % 3];
                const colors = [steel, "#3D7A5C", brass];
                return (
                  <Box key={cls.id} sx={{ mb: i < 2 ? 2 : 0 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                      <Typography sx={{ fontSize: 13, color: slate }}>{cls.class_name}</Typography>
                      <Typography className={plexMono.className} sx={{ fontSize: 12.5, color: ink, fontWeight: 600 }}>
                        {pct}%
                      </Typography>
                    </Box>
                    <Box sx={{ height: 7, borderRadius: 999, bgcolor: "#EEF2F8", overflow: "hidden" }}>
                      <Box sx={{ height: "100%", width: `${pct}%`, bgcolor: colors[i % 3], borderRadius: 999 }} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Dua kolom: kiri "My Classes" gaya register/buku besar (data
              asli), kanan "Recent Integrity Alerts" (hardcode, belum ada
              endpoint-nya — fitur ini relevan buat app pemantau integritas). */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.6fr 1fr" },
              gap: 3,
            }}
          >
            
            <Box>
              <Typography className={fraunces.className} sx={{ fontSize: 20, fontWeight: 600, color: ink, mb: 2 }}>
                Recent Integrity Alerts
              </Typography>

              <Box sx={{ border: `1px solid ${line}`, borderRadius: 1.5, p: 0.5 }}>
                {integrityAlerts.map((alert, i) => (
                  <Box
                    key={alert.id}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      p: 2,
                      borderBottom: i < integrityAlerts.length - 1 ? `1px solid ${line}` : "none",
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: severityColor(alert.similarity),
                        mt: 0.7,
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14, color: ink }}>
                        {alert.student}
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: slate }}>
                        {alert.assignment}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.6 }}>
                        <AutoAwesomeRoundedIcon sx={{ fontSize: 13, color: severityColor(alert.similarity) }} />
                        <Typography
                          className={plexMono.className}
                          sx={{ fontSize: 12, color: severityColor(alert.similarity), fontWeight: 600 }}
                        >
                          {alert.similarity}% match
                        </Typography>
                        <Typography className={plexMono.className} sx={{ fontSize: 11, color: "#9FB2CB" }}>
                          · {alert.time}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}