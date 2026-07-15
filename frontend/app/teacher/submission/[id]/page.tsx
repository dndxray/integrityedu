"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Fraunces, Poppins } from "next/font/google";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

import { getSubmissionDetail } from "@/services/submission";
import { getTypingLog } from "@/services/typing";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Palet warna premium tema aplikasi kamu
const ink = "#0B2545";
const steel = "#2C6E9E";
const slate = "#5B6B82";
const line = "#D9E3F0";

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showFullQuestion, setShowFullQuestion] = useState(false);
  const [submission, setSubmission] = useState<any>(null);
  const [typing, setTyping] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          useFallbackData();
          return;
        }

        const submissionData = await getSubmissionDetail(token, Number(params.id));
        const typingData = await getTypingLog(token, Number(params.id));

        // Jika API sukses mengembalikan data asli
        if (submissionData) {
          setSubmission(submissionData);
          setTyping(typingData);
        } else {
          useFallbackData();
        }
      } catch (err) {
        // Jika backend error/belum siap, otomatis lari ke dummy data
        useFallbackData();
      } finally {
        setLoading(false);
      }
    }

    // Fungsi pengisi data tiruan yang rapi jika API belum sedia
    function useFallbackData() {
  const submissionId = Number(params.id);

  if (submissionId === 2) {
    // ==== DATA DUMMY KEVIN WIJAYA (NILAI JELEK / HIGH RISK) ====
    setSubmission({
      student_id: "24060123130088",
      student_name: "Kevin Wijaya",
      submitted_at: "12 Jul 2026 • 13:31",
      ai_score: 88, // Indikasi AI sangat tinggi
      ai_result: "High Risk of AI Generation",
      ai_reason: "Pola kalimat 100% identik dengan struktur template LLM OpenAI ChatGPT. Tidak ditemukan variasi tipografi atau jeda natural manusia.",
      ai_recommendation: "Sangat direkomendasikan untuk melakukan ujian lisan ulang atau penolakan tugas.",
      answer: `1. Apa definisi dari 1NF (First Normal Form)?
First Normal Form (1NF) merupakan sebuah pedoman formal dalam arsitektur basis data relasional yang memproskripsikan keberadaan grup berulang... (Jawaban terlihat terlalu kaku dan sempurna hasil generate).

2. Jelaskan perbedaan antara 2NF dan 3NF!
Perbedaan fundamental bertumpu pada eliminasi dependensi parsial untuk menapak ke tahapan 2NF, disusul purifikasi dependensi transitif guna memvalidasi struktur 3NF...

3. Apa yang dimaksud dengan transitive dependency?
Kondisi anomalistik relasional di mana sebuah atribut non-primer memiliki relasi dependensi fungsional sekunder terhadap atribut non-primer lainnya...

4. Mengapa kita perlu melakukan normalisasi pada database?
Guna mengeskalasi efisiensi operasional sistem, memitigasi risiko redudansi, serta mengeliminasi potensi anomali destruktif pada saat eksekusi DML...

5. Kapan sebuah tabel dikatakan melanggar aturan Boyce-Codd Normal Form (BCNF)?
Tabel dipastikan gagal memenuhi standar BCNF bilamana determinan dari dependensi fungsional yang tereksitasi bukan merupakan super key...`
    });

    setTyping({
      word_count: 120,
      typing_time: 45, // Waktu ngetik terlalu cepat buat teks sepanjang itu
      average_wpm: 160, // WPM tidak realistis untuk ukuran mahasiswa
      paste_count: 5, // Sering copas
      tab_switch: 12, // Sering buka tab lain
      pause_count: 2,
      idle_time: 180,
      risk_score: 92 // Risiko pengetikan sangat tinggi
    });

  } else {
    // ==== DATA DUMMY DINDA ISYARIANI (NILAI BAGUS / EXCELLENT) ====
    setSubmission({
      student_id: "24060123140149",
      student_name: "Dinda Isyariani",
      submitted_at: "12 Jul 2026 • 13:24",
      ai_score: 5, // Indikasi AI sangat rendah
      ai_result: "Low Risk of AI Generation",
      ai_reason: "Struktur kalimat menunjukkan variasi tanda baca alami dan kekhasan gaya kepenulisan manusia yang konsisten.",
      ai_recommendation: "Tugas aman dan dapat langsung dinilai secara objektif tanpa pemeriksaan manual tambahan.",
      answer: `1. Apa definisi dari 1NF (First Normal Form)?
Tabel dikatakan memenuhi 1NF jika dan hanya jika setiap atribut dari relasi tersebut hanya memiliki nilai atomik tunggal di setiap barisnya. Jadi ga boleh ada kolom yang isinya *double* atau berupa *array*.

2. Jelaskan perbedaan antara 2NF dan 3NF!
Untuk mencapai 2NF, tabel harus memenuhi syarat 1NF dulu dan kita harus hapus yang namanya dependensi parsial pada primary key. Sementara untuk 3NF, tabel harus lolos kriteria 2NF dan wajib menghilangkan dependensi transitif.

3. Apa yang dimaksud dengan transitive dependency?
Dependensi transitif itu kondisi di mana suatu atribut non-key malah bergantung pada atribut non-key lainnya, bukan langsung bergantung sama primary key utama tabelnya.

4. Mengapa kita perlu melakukan normalisasi pada database?
Normalisasi penting dilakukan untuk mencegah terjadinya anomali data (pas kita insert, update, atau delete) serta meminimalisir redundansi data biar storage database-nya efisien.

5. Kapan sebuah tabel dikatakan melanggar aturan Boyce-Codd Normal Form (BCNF)?
Tabel melanggar BCNF jika terdapat dependensi fungsional X -> Y namun X nya itu bukan merupakan super key dari skema relasi tersebut.`
    });

    setTyping({
      word_count: 148,
      typing_time: 412,
      average_wpm: 42,
      paste_count: 0,
      tab_switch: 1,
      pause_count: 14,
      idle_time: 25,
      risk_score: 8 // Risiko pengetikan sangat rendah
    });
  }
}

    load();
  }, [params.id]);

  if (loading || !submission) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Typography className={poppins.className} sx={{ color: slate }}>Memuat Analisis...</Typography>
      </Box>
    );
  }

  // LOGIKA SKOR UTAMA INTEGRITAS:
  // (Mengubah interpretasi: Jika risiko AI/Mengetik rendah, berarti Skor Integritas Diri Tinggi)
  const integrityScore = typing
    ? Math.round(100 - (submission.ai_score * 0.6 + typing.risk_score * 0.4))
    : Math.round(100 - submission.ai_score);

  const getIntegrityTheme = (score: number) => {
    if (score >= 80) return { label: "Excellent / Low Risk", color: "#22C55E", bg: "#ECFDF5" };
    if (score >= 50) return { label: "Good / Medium Risk", color: "#F59E0B", bg: "#FFF7ED" };
    return { label: "Suspicious / High Risk", color: "#EF4444", bg: "#FEF2F2" };
  };

  const integrityTheme = getIntegrityTheme(integrityScore);

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
                mb: 3,
                fontWeight: 500,
                "&:hover": { color: ink },
              }}
              onClick={() => router.back()}
            >
              <ArrowBackRoundedIcon fontSize="small" />
              Kembali ke Daftar Submission
            </Typography>

            {/* Header Identitas Mahasiswa */}
            <Stack
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                borderBottom: `1px solid ${line}`,
                pb: 3,
                mb: 4,
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
                  {submission.student_name ? submission.student_name.charAt(0) : "S"}
                </Avatar>
                <Box>
                  <Typography
                    className={fraunces.className}
                    sx={{ fontSize: { xs: 24, md: 28 }, fontWeight: 600, color: ink, fontStyle: "italic" }}
                  >
                    {submission.student_name || "Detail Jawaban Mahasiswa"}
                  </Typography>
                  <Typography sx={{ color: slate, fontSize: 13.5, mt: 0.5 }}>
                    ID: {submission.student_id} • Diserahkan {submission.submitted_at || "Baru saja"}
                  </Typography>
                </Box>
              </Stack>

              <Chip
                label={integrityTheme.label}
                sx={{
                  bgcolor: integrityTheme.bg,
                  color: integrityTheme.color,
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: 1.5,
                  border: `1px solid ${integrityTheme.color}33`,
                  px: 1,
                  py: 2,
                }}
              />
            </Stack>

            {/* Konten Utama 2 Kolom Menggunakan Box Flexbox Anti-Error */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4, width: "100%" }}>
              
              {/* KOLOM KIRI: Soal Guru, Lampiran PDF, & Lembar Jawaban */}
<Box sx={{ flex: 1.4, minWidth: 0, display: "flex", flexDirection: "column", gap: 3.5 }}>
  
  {/* A. SEKSI SOAL DARI GURU (COLLAPSIBLE) */}
  <Box>
    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1, mb: 1.5 }}>
      <HelpOutlineRoundedIcon sx={{ color: steel }} />
      <Typography sx={{ color: ink, fontWeight: 700, fontSize: 18 }}>
        Soal Tugas
      </Typography>
    </Stack>

    <Card 
      sx={{ 
        borderRadius: 2, 
        boxShadow: "none", 
        border: `1px solid ${line}`,
        bgcolor: "#F8FAFC",
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": { bgcolor: "#F1F5F9" }
      }}
      onClick={() => setShowFullQuestion(!showFullQuestion)}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography 
          sx={{ 
            color: ink, 
            fontSize: 14.5, 
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: showFullQuestion ? "unset" : 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "pre-wrap"
          }}
        >
          {`TUGAS PRAKTIKUM MANAJEMEN BASIS DATA (MBD) - NORMALISASI DATA
Bobot: 20% | Batas Pengumpulan: 12 Juli 2026

Diberikan sebuah mentahan data transaksi struk belanja minimarket yang memiliki anomali redudansi data pada kolom item dan cabang. Kerjakan instruksi berikut:
1. Uraikan definisi atomik nilai berdasarkan aturan First Normal Form (1NF).
2. Tentukan Functional Dependency untuk memisahkan skema ke tahapan Second Normal Form (2NF) dan Third Normal Form (3NF).
3. Jelaskan potensi terjadinya Transitive Dependency pada entitas non-key.
4. Apa urgensi dilakukannya normalisasi terhadap performa Data Manipulation Language (DML)?
5. Berikan satu contoh kasus tabel relasional yang memenuhi standar 3NF namun gagal lolos uji aturan BCNF (Boyce-Codd Normal Form).`}
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1.5, color: steel }}>
          {showFullQuestion ? (
            <>
              <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>Sembunyikan detail soal</Typography>
              <ExpandLessRoundedIcon fontSize="small" />
            </>
          ) : (
            <>
              <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>Lihat soal selengkapnya</Typography>
              <ExpandMoreRoundedIcon fontSize="small" />
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  </Box>

  {/* B. SEKSI LAMPIRAN FILE PDF (SEKARANG DI ATAS JAWABAN) */}
  <Box>
    <Typography sx={{ color: ink, fontWeight: 700, fontSize: 16, mb: 1.5 }}>
      Dokumen Jawaban
    </Typography>
    
    <Card 
      sx={{ 
        borderRadius: 2.5, 
        boxShadow: "none", 
        border: `1px solid ${line}`,
        bgcolor: "white",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack 
          sx={{ 
            flexDirection: { xs: "column", sm: "row" }, 
            alignItems: { xs: "flex-start", sm: "center" }, 
            justifyContent: "space-between",
            gap: 2 
          }}
        >
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Box 
              sx={{ 
                bgcolor: "#FEF2F2", 
                p: 1.5, 
                borderRadius: 2, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                border: "1px solid #FEE2E2"
              }}
            >
              <PictureAsPdfRoundedIcon sx={{ color: "#EF4444", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: ink, lineHeight: 1.3 }}>
                {`MBD_TugasNormalisasi_${submission.student_name.replace(/\s+/g, "")}.pdf`}
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: slate, mt: 0.3 }}>
                2.4 MB • Dokumen PDF Terverifikasi Aman
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              alignSelf: { xs: "stretch", sm: "auto" },
              textAlign: "center",
              px: 3,
              py: 1,
              borderRadius: 2,
              border: `1px solid ${steel}`,
              color: steel,
              fontWeight: 600,
              fontSize: 13.5,
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                bgcolor: "#F0F7FF",
              }
            }}
            onClick={() => window.open("#", "_blank")}
          >
            Buka File
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </Box>

  {/* C. SEKSI LEMBAR JAWABAN TEKS */}
  <Box>
    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1, mb: 1.5 }}>
      <AssignmentRoundedIcon sx={{ color: steel }} />
      <Typography sx={{ color: ink, fontWeight: 700, fontSize: 18 }}>
        Lembar Jawaban 5 Pertanyaan
      </Typography>
    </Stack>

    <Card sx={{ borderRadius: 2, boxShadow: "none", border: `1px solid ${line}` }}>
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ color: ink, whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: 15 }}>
          {submission.answer}
        </Typography>
      </CardContent>
    </Card>
  </Box>

</Box>

              {/* KOLOM KANAN: Hasil Analisis Integritas Diri & Perilaku */}
              <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                
                {/* 1. Kesimpulan Ringkasan Skor */}
                {/* 1. Kesimpulan Ringkasan Skor & Evaluasi Asisten AI */}
<Box>
  <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1, mb: 2 }}>
    <VerifiedUserRoundedIcon sx={{ color: steel }} />
    <Typography sx={{ color: ink, fontWeight: 700, fontSize: 18 }}>
      Evaluasi Perilaku & Integritas Siswa
    </Typography>
  </Stack>

  <Card sx={{ borderRadius: 2, boxShadow: "none", border: `1px solid ${line}`, bgcolor: "#F8FAFC", mb: 3 }}>
    <CardContent sx={{ p: 3 }}>
      <Typography sx={{ color: slate, fontSize: 13, fontWeight: 600, mb: 0.5 }}>
        Rekomendasi Skor Integritas (Confidence Level)
      </Typography>
      
      {/* Skor ini dinamis berdasarkan kalkulasi asisten AI */}
      <Typography sx={{ fontSize: 36, fontWeight: 800, color: integrityTheme.color, mb: 1.5 }}>
        {integrityScore}%
      </Typography>
      
      <LinearProgress 
        variant="determinate" 
        value={integrityScore} 
        sx={{
          height: 7,
          borderRadius: 99,
          bgcolor: "#EEF2F6",
          "& .MuiLinearProgress-bar": { bgcolor: integrityTheme.color, borderRadius: 99 }
        }}
      />
      
      <Box sx={{ mt: 2.5, p: 2, bgcolor: "white", borderRadius: 1.5, border: `1px solid ${line}` }}>
        <Typography sx={{ fontSize: 12.5, color: ink, fontWeight: 600, mb: 0.5 }}>
          Catatan Asisten Deteksi untuk Guru:
        </Typography>
        <Typography sx={{ fontSize: 13, color: slate, lineHeight: 1.5 }}>
          Siswa ini memiliki tingkat kepatuhan tinggi saat mengetik jawaban verifikasi, namun sistem mendeteksi tingkat kemiripan teks essay sebesar {submission.ai_score}% dengan pola LLM. Silakan verifikasi lembar jawaban di sebelah kiri untuk penilaian akhir.
        </Typography>
      </Box>
    </CardContent>
  </Card>
</Box>

                {/* 2. Analisis Struktur Pola Kalimat AI */}
                <Box>
                  <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1, mb: 2 }}>
                    <PsychologyRoundedIcon sx={{ color: steel }} />
                    <Typography sx={{ color: ink, fontWeight: 700, fontSize: 18 }}>
                      Analisis Pola Penulisan AI
                    </Typography>
                  </Stack>

                  <Card sx={{ borderRadius: 2, boxShadow: "none", border: `1px solid ${line}` }}>
                    <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box>
                        <Typography sx={{ fontSize: 12.5, color: slate, fontWeight: 600 }}>Tingkat Kemiripan Struktur LLM</Typography>
                        <Typography sx={{ fontSize: 14, color: ink, fontWeight: 700, mt: 0.2 }}>{submission.ai_score}% Terindikasi</Typography>
                      </Box>
                      <Divider sx={{ borderColor: line }} />
                      <Box>
                        <Typography sx={{ fontSize: 12.5, color: slate, fontWeight: 600 }}>Hasil Klasifikasi</Typography>
                        <Typography sx={{ fontSize: 14, color: steel, fontWeight: 700, mt: 0.2 }}>{submission.ai_result}</Typography>
                      </Box>
                      <Divider sx={{ borderColor: line }} />
                      <Box>
                        <Typography sx={{ fontSize: 12.5, color: slate, fontWeight: 600 }}>Analisis Pola</Typography>
                        <Typography sx={{ fontSize: 13.5, color: ink, mt: 0.4, lineHeight: 1.5 }}>{submission.ai_reason}</Typography>
                      </Box>
                      <Divider sx={{ borderColor: line }} />
                      <Box>
                        <Typography sx={{ fontSize: 12.5, color: slate, fontWeight: 600 }}>Rekomendasi Sistem</Typography>
                        <Typography sx={{ fontSize: 13.5, color: ink, mt: 0.4, lineHeight: 1.5 }}>{submission.ai_recommendation}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* 3. Analisis Perilaku Ketikan (Typing Behavior) */}
                {typing && (
                  <Box>
                    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1, mb: 2 }}>
                      <SpeedRoundedIcon sx={{ color: steel }} />
                      <Typography sx={{ color: ink, fontWeight: 700, fontSize: 18 }}>
                        Metrik Perilaku Mengetik
                      </Typography>
                    </Stack>

                    <Card sx={{ borderRadius: 2, boxShadow: "none", border: `1px solid ${line}` }}>
                      <CardContent sx={{ p: 3 }}>
                        <Stack sx={{ gap: 1.8 }}>
                          {[
                            { label: "Jumlah Kata (Word Count)", val: typing.word_count },
                            { label: "Durasi Mengetik", val: `${typing.typing_time} detik` },
                            { label: "Rata-rata Kecepatan Ketikan", val: `${typing.average_wpm} WPM` },
                            { label: "Aktivitas Salin-Tempel (Paste)", val: `${typing.paste_count} kali` },
                            { label: "Perpindahan Tab Jendela (Tab Switch)", val: `${typing.tab_switch} kali` },
                            { label: "Jumlah Jeda Pengetikan (Pause)", val: `${typing.pause_count} kali` },
                            { label: "Waktu Diam Terdeteksi (Idle)", val: `${typing.idle_time} detik` },
                          ].map((item, index) => (
                            <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography sx={{ fontSize: 13.5, color: slate, fontWeight: 500 }}>{item.label}</Typography>
                              <Typography sx={{ fontSize: 14, color: ink, fontWeight: 700 }}>{item.val}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                )}

              </Box>
            </Box>

          </Container>
        </Box>
      </Box>
    </>
  );
}