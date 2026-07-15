"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Grid from "@mui/material/Grid";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StudentNavbar from "@/components/StudentNavbar";
import StudentSidebar from "@/components/StudentSidebar";

import { getMyClasses } from "@/services/student";

interface ClassData {
  id: number;
  class_name: string;
  class_code: string;
  description: string;
}

export default function MyClassesPage() {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClasses() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoadError("Please login first.");
          return;
        }

        const data = await getMyClasses(token);

        if (Array.isArray(data)) {
          setClasses(data);
        } else {
          console.error(data);
          setLoadError(data?.detail ?? "Failed to load classes.");
          setClasses([]);
        }
      } catch (err) {
        console.error(err);
        setLoadError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadClasses();
  }, []);

  // Tanggal hari ini beneran (bukan hardcode), samain formatnya sama Dashboard
  // const today = new Date().toLocaleDateString("id-ID", {
  //   weekday: "long",
  //   day: "numeric",
  //   month: "long",
  //   year: "numeric",
  // });

  return (
    <>
      <StudentSidebar />
      <StudentNavbar />

      {/* Background lavender + panel putih rounded, konsisten sama Dashboard */}
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
          {/* Search bar + tanggal, gantiin fungsi Navbar */}
          <Stack
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 3,
            }}
          >
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                gap: 1.2,
                bgcolor: "#F5F6FB",
                borderRadius: 999,
                px: 2.5,
                py: 1.1,
                width: { xs: "100%", sm: 340 },
              }}
            >
              <SearchRoundedIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
              <Typography sx={{ color: "#94A3B8", fontSize: 14.5 }}>
                {/* TODO: belum tersambung ke pencarian beneran */}
                Cari kelas...
              </Typography>
            </Stack>

            {/* <Typography sx={{ color: "#94A3B8", fontSize: 14, fontWeight: 500 }}>
              {today}
            </Typography> */}
          </Stack>

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
              gap: 2,
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                }}
              >
                My Classes
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                View and manage all classes you have joined.
              </Typography>
            </Box>

            {/* <Button
              variant="contained"
              onClick={() =>
                router.push("/student/join-class")
              }
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
              }}
            >
              Join New Class
            </Button> */}
          </Stack>

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

          <Grid
            container
            spacing={2.5}
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Grid
                  key={index}
                  size={{ xs: 12, md: 6 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "none",
                      border: "1px solid #EEF0F6",
                    }}
                  >
                    <CardContent>
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={34}
                      />

                      <Skeleton
                        variant="text"
                        width="90%"
                        height={24}
                        sx={{ mt: 1 }}
                      />

                      <Skeleton
                        variant="rounded"
                        width={90}
                        height={28}
                        sx={{ mt: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : classes.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #EEF0F3",
                    boxShadow: "none",
                  }}
                >
                  <CardContent
                    sx={{
                      py: 8,
                      textAlign: "center",
                    }}
                  >
                    <MenuBookRoundedIcon
                      sx={{
                        fontSize: 56,
                        color: "#CBD5E1",
                        mb: 2,
                      }}
                    />

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      No Classes Yet
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        mb: 3,
                      }}
                    >
                      Join a class using the class code provided by your teacher.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              (Array.isArray(classes) ? classes : []).map((item) => (
                <Grid
                  key={item.id}
                  size={{ xs: 12, md: 6 }}
                >
                  <Card
                    sx={{
                      borderRadius: 2,
                      border: "1px solid #EEF0F6",
                      boxShadow: "none",
                      height: "100%",
                      transition: ".2s",

                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 10px 24px rgba(15,23,42,.08)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 3,
                      }}
                    >
                      <Stack
                        sx={{
                          height: "100%",
                          justifyContent: "space-between",
                          gap: 3,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            {item.class_name}
                          </Typography>

                          <Typography
                            color="text.secondary"
                            sx={{
                              mt: 1,
                              minHeight: 48,
                            }}
                          >
                            {item.description || "No description"}
                          </Typography>

                          <Chip
                            label={item.class_code}
                            size="small"
                            sx={{
                              mt: 2,
                              bgcolor: "#EEF2FF",
                              color: "#3346C4",
                              fontWeight: 600,
                            }}
                          />
                        </Box>

                        <Button
                          variant="outlined"
                          endIcon={<ArrowForwardRoundedIcon />}
                          onClick={() =>
                            router.push(
                              `/student/class/${item.id}`
                            )
                          }
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            alignSelf: "flex-start",
                          }}
                        >
                          Open Class
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
}