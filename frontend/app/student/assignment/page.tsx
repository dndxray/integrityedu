"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import Navbar from "@/components/Navbar";
import StudentSidebar from "@/components/StudentSidebar";

import { getMyAssignments } from "@/services/assignment";

export default function AssignmentsPage() {
  const router = useRouter();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");

      if (!token) return;

      const data = await getMyAssignments(token);

      if (Array.isArray(data)) {
        setAssignments(data);
      } else {
        setAssignments([]);
      }

      setLoading(false);
    }

    load();
  }, []);

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
          bgcolor: "#F8FAFC",
          minHeight: "100vh",
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
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Stack
  sx={{
    mb: 4,
    gap: 0.5,
  }}
>
  <Typography
    variant="h4"
    fontWeight={700}
  >
    Assignments
  </Typography>

  <Typography color="text.secondary">
    View and manage all assignments from your enrolled classes.
  </Typography>
</Stack>

            <Stack spacing={2.5}>
              {assignments.length === 0 ? (
                <Card>
                  <CardContent>
                    <Typography align="center">
                      No assignments found.
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                assignments.map((assignment) => (
                  <Card
  key={assignment.id}
  sx={{
    width: "100%",
    cursor: "pointer",
    borderRadius: 3,
    border: "1px solid #EEF0F3",
    boxShadow: "0 1px 3px rgba(15,23,42,.08)",
    transition: ".2s",

    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 24px rgba(15,23,42,.08)",
    },
  }}
                    onClick={() =>
                      router.push(
                        `/student/assignment/${assignment.id}`
                      )
                    }
                  >
                    <CardContent>
                      <Stack
                        sx={{
                          display: "flex",
                          flexDirection: {
                            xs: "column",
                            md: "row",
                          },
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                          >
                            {assignment.title}
                          </Typography>

                          <Typography
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            {assignment.description}
                          </Typography>
                        </Box>

                        <Chip
                          color="primary"
                          label={new Date(
                            assignment.deadline
                          ).toLocaleDateString()}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}