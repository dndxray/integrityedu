"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import Navbar from "@/components/Navbar";
import StudentSidebar from "@/components/StudentSidebar";
// const API_URL = "http://127.0.0.1:8000";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
export default function StudentClassPage() {
  const router = useRouter();
  const params = useParams();

  const classId = Number(params.id);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [classroom, setClassroom] = useState<any>(null);

  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoadError("Please login first.");
          return;
        }

        // ==========================
        // Class Detail
        // ==========================

        const classResponse = await fetch(
          `${API_URL}/classes/student/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const classData = await classResponse.json();

        if (classResponse.ok) {
          setClassroom(classData);
        } else {
          setLoadError(
            classData?.detail ?? "Failed to load class."
          );
          return;
        }

        // ==========================
        // Assignment List
        // ==========================

        const assignmentResponse = await fetch(
          `${API_URL}/assignments/student/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const assignmentData =
          await assignmentResponse.json();

        if (Array.isArray(assignmentData)) {
          setAssignments(assignmentData);
        } else {
          setAssignments([]);
        }
      } catch (err) {
        console.error(err);

        setLoadError(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    }

    if (!isNaN(classId)) {
      loadData();
    }
  }, [classId]);

  if (loading) {
    return (
      <>
        <StudentSidebar />
        <Navbar />

        <Box
          sx={{
            ml: {
              xs: 0,
              md: "260px",
            },
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <StudentSidebar />
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F8FAFC",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            ml: {
              xs: 0,
              md: "280px",
            },

            width: {
              xs: "100%",
              md: "calc(100% - 280px)",
            },

            pt: {
              xs: 10,
              md: 12,
            },

            pb: 5,

            px: {
              xs: 2,
              sm: 3,
              md: 4,
              lg: 5,
            },
          }}
        >
          <Box sx={{ width: "100%" }}>
            {/* Back link di atas banner, bukan di dalamnya lagi */}
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => router.back()}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "text.secondary",
                mb: 2,
                pl: 0,
                "&:hover": {
                  bgcolor: "transparent",
                  color: "text.primary",
                },
              }}
            >
              Back
            </Button>

            <Card
              sx={{
                mb: 4,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg,#4F46E5 0%,#2563EB 100%)",
                color: "white",
                boxShadow: "0 16px 32px rgba(37,99,235,.22)",
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 3,
                    md: 4,
                  },
                }}
              >
                <Stack
                  sx={{
                    flexDirection: {
                      xs: "column",
                      md: "row",
                    },
                    justifyContent: "space-between",
                    alignItems: {
                      xs: "flex-start",
                      md: "center",
                    },
                    gap: 3,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Chip
                      icon={<SchoolRoundedIcon />}
                      label={classroom?.class_code}
                      sx={{
                        mb: 2,
                        bgcolor: "rgba(255,255,255,.15)",
                        color: "white",
                        borderRadius: 1.5,

                        "& .MuiChip-icon": {
                          color: "white",
                        },
                      }}
                    />

                    <Typography variant="h3" sx={{ fontWeight: 800 }}>
                      {classroom?.class_name}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 2,
                        opacity: 0.9,
                        maxWidth: 700,
                        lineHeight: 1.7,
                      }}
                    >
                      {classroom?.description}
                    </Typography>
                  </Box>

                  {/* Stat card berdiri sendiri, nggak lagi digabung sama tombol Back */}
                  <Card
                    sx={{
                      bgcolor: "rgba(255,255,255,.12)",
                      backdropFilter: "blur(12px)",
                      borderRadius: 2,
                      textAlign: "center",
                      color: "white",
                      minWidth: {
                        xs: "100%",
                        md: 180,
                      },
                      boxShadow: "none",
                    }}
                  >
                    <CardContent>
                      <Typography sx={{ opacity: 0.8 }}>
                        Assignments
                      </Typography>

                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {assignments.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </CardContent>
            </Card>

            {loadError && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                }}
              >
                {loadError}
              </Alert>
            )}

            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: 700 }}
            >
              Assignments
            </Typography>

            {assignments.length === 0 ? (
              <Card
                sx={{
                  borderRadius: 1.5,
                }}
              >
                <CardContent
                  sx={{
                    py: 8,
                  }}
                >
                  <Typography align="center" color="text.secondary">
                    No assignments available yet.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {assignments.map((assignment) => (
                  <Grid
                    key={assignment.id}
                    size={{
                      xs: 12,
                    }}
                  >
                    <Card
                      sx={{
                        borderRadius: 1.5,
                        cursor: "pointer",
                        border: "1px solid #EEF2F7",
                        transition: ".2s",

                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 12px 28px rgba(15,23,42,.08)",
                        },
                      }}
                      onClick={() =>
                        router.push(
                          `/student/assignment/${assignment.id}`
                        )
                      }
                    >
                      <CardContent
                        sx={{
                          p: 3,
                        }}
                      >
                        <Stack
                          sx={{
                            flexDirection: {
                              xs: "column",
                              lg: "row",
                            },
                            justifyContent: "space-between",
                            alignItems: {
                              xs: "flex-start",
                              lg: "center",
                            },
                            gap: 3,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Stack
                              sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1.5,
                                mb: 1.5,
                              }}
                            >
                              <AssignmentRoundedIcon color="primary" />

                              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {assignment.title}
                              </Typography>
                            </Stack>

                            <Typography
                              color="text.secondary"
                              sx={{
                                lineHeight: 1.8,
                              }}
                            >
                              {assignment.description}
                            </Typography>
                          </Box>

                          <Stack
                            sx={{
                              gap: 1.5,
                              alignItems: {
                                xs: "flex-start",
                                lg: "flex-end",
                              },
                            }}
                          >
                            <Chip
                              color="primary"
                              variant="outlined"
                              label={`Due • ${new Date(
                                assignment.deadline
                              ).toLocaleDateString()}`}
                              sx={{ borderRadius: 1.5 }}
                            />

                            <Typography color="primary" sx={{ fontWeight: 700 }}>
                              Open →
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}