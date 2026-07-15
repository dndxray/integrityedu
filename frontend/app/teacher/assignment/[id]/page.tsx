"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bluePrimary = "#185FA5";
const blueDark = "#0C447C";
const blueLight = "#E6F1FB";
const slate = "#64748B";

export default function AssignmentSubmissionPage() {
  const params = useParams();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    setSubmissions([
      {
        id: 1,
        student: "Dinda Isyariani",
        submittedAt: "12 Jul 2026 • 13:24",
        academicScore: 92,
        integrityScore: 96,
        risk: "Excellent",
        aiSummary:
          "Writing style is consistent with previous submissions and verification answers are strong.",
      },
      {
        id: 2,
        student: "Kevin Wijaya",
        submittedAt: "12 Jul 2026 • 13:31",
        academicScore: 94,
        integrityScore: 63,
        risk: "Needs Review",
        aiSummary:
          "Writing style changed significantly. Multiple tab switches were detected.",
      },
      {
        id: 3,
        student: "Siti Rahma",
        submittedAt: "12 Jul 2026 • 13:37",
        academicScore: 88,
        integrityScore: 89,
        risk: "Good",
        aiSummary:
          "Good understanding of the material with only minor inconsistencies.",
      },
      {
        id: 4,
        student: "Ahmad Fauzi",
        submittedAt: "12 Jul 2026 • 13:42",
        academicScore: 80,
        integrityScore: 75,
        risk: "Fair",
        aiSummary:
          "Verification score is lower than the assignment score. Needs teacher attention.",
      },
    ]);
  }, []);

  const getIntegrityColor = (score: number) => {
    if (score >= 90) return "#22C55E";
    if (score >= 80) return "#3B82F6";
    if (score >= 70) return "#F59E0B";
    return "#EF4444";
  };

  const getChipColor = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 80) return "info";
    if (score >= 70) return "warning";
    return "error";
  };

  return (
    <>
    <Sidebar />
        <Navbar />
<Box sx={{ display: "flex", width: "100%" }}>
        

    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "#EAF4FF",
        p: { xs: 1.5, md: 3 },      // Samakan padding luarnya dengan page Create Class
        ml: { xs: 0, md: "260px" },  // Menggeser dari posisi sidebar
        flexGrow: 1,                 // Wajib! Supaya box konten utama melebar penuh ke kanan
        width: { md: "calc(100% - 260px)" }, // Mencegah terjadinya overflow horizontal
      }}
    >
      <Box
        className={poppins.className}
        sx={{
          bgcolor: "white",          // HAPUS tanda '#' yang typo kemarin agar warna putihnya valid
          borderRadius: 3,           // Samakan dengan page Create Class
          minHeight: "calc(100vh - 48px)", // Samakan tinggi minimumnya
          boxShadow: "0 20px 45px -20px rgba(51,70,196,0.15)", // Menggunakan shadow tipis elegan dari page Create Class
          p: { xs: 2.5, md: 4 },
        }}
      >
        {/* Pastikan menggunakan maxWidth="xl" atau hapus Container ini agar melebar ke pinggir seperti form kamu */}
        <Container maxWidth="xl" disableGutters>
          
          <Typography
            sx={{
              fontSize: { xs: 26, md: 32 },
              fontWeight: 700,
              color: blueDark,
            }}
          >
            Student submissions
          </Typography>

            <Typography
              sx={{
                color: slate,
                mt: 1,
                mb: 4,
                maxWidth: 520,
              }}
            >
              Database Normalization Assignment
            </Typography>

            <Grid container spacing={2} sx={{ mb: 5 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "none",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <CardContent>
                    <Typography sx={{ color: slate, fontSize: 13, mb: 1 }}>
                      Submitted
                    </Typography>
                    <Typography sx={{ fontSize: 30, fontWeight: 700, color: blueDark }}>
                      28 / 35
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "none",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <CardContent>
                    <Typography sx={{ color: slate, fontSize: 13, mb: 1 }}>
                      Average academic score
                    </Typography>
                    <Typography sx={{ fontSize: 30, fontWeight: 700, color: bluePrimary }}>
                      88
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "none",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <CardContent>
                    <Typography sx={{ color: slate, fontSize: 13, mb: 1 }}>
                      Average integrity score
                    </Typography>
                    <Typography sx={{ fontSize: 30, fontWeight: 700, color: "#22C55E" }}>
                      91%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

           
            <Stack spacing={2.5}>
              {submissions.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    borderRadius: 4,
                    boxShadow: "none",
                    border: "1px solid #E7EDF5",
                    transition: ".2s",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: bluePrimary,
                      boxShadow: "0 12px 28px rgba(24,95,165,.10)",
                    },
                  }}
                  onClick={() => router.push(`/teacher/submission/${item.id}`)}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
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
                            width: 52,
                            height: 52,
                            bgcolor: blueLight,
                            color: blueDark,
                            fontWeight: 700,
                            fontSize: 20,
                          }}
                        >
                          {item.student.charAt(0)}
                        </Avatar>

                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                            {item.student}
                          </Typography>
                          <Typography sx={{ color: slate, fontSize: 13, mt: 0.3 }}>
                            Submitted {item.submittedAt}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        label={item.risk}
                        color={getChipColor(item.integrityScore)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Stack>

                    <Grid container spacing={3} sx={{ mt: 5 }}>
                      <Grid size={{ xs: 6, md: 4 }}>
                        <Typography sx={{ color: slate, fontSize: 13, mb: 0.5 }}>
                          Academic score
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: 24, color: bluePrimary }}>
                          {item.academicScore}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 6, md: 4 }}>
                        <Typography sx={{ color: slate, fontSize: 13, mb: 0.5 }}>
                          Integrity score
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 24,
                            color: getIntegrityColor(item.integrityScore),
                          }}
                        >
                          {item.integrityScore}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={item.integrityScore}
                          sx={{
                            mt: 1,
                            height: 6,
                            borderRadius: 999,
                            bgcolor: "#EEF2F6",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: getIntegrityColor(item.integrityScore),
                              borderRadius: 999,
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography sx={{ color: slate, fontSize: 13, mb: 0.5 }}>
                          AI recommendation
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: 15,
                            color: getIntegrityColor(item.integrityScore),
                          }}
                        >
                          {item.risk}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        mt: 3,
                        p: 2.25,
                        borderRadius: 3,
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: 13, color: slate, mb: 0.75 }}>
                        AI summary
                      </Typography>
                      <Typography sx={{ color: "#475569", fontSize: 14, lineHeight: 1.7 }}>
                        {item.aiSummary}
                      </Typography>
                    </Box>

                    <Stack sx={{ flexDirection: "row", justifyContent: "flex-end", mt: 2.5 }}>
                      <Stack
                        sx={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 0.75,
                          px: 2.5,
                          py: 1,
                          borderRadius: 99,
                          bgcolor: bluePrimary,
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: 14,
                          transition: ".2s",
                          "&:hover": {
                            bgcolor: blueDark,
                          },
                        }}
                      >
                        <span>View detail</span>
                        <ArrowForwardIcon sx={{ fontSize: 16 }} />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
    </>
  );
}