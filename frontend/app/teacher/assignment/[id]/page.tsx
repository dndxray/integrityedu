"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

import { getSubmissions } from "@/services/submission";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function AssignmentSubmissionPage() {
  const params = useParams();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");

      if (!token) return;

      const data = await getSubmissions(
        token,
        Number(params.id)
      );

      setSubmissions(data);
    }

    load();
  }, [params.id]);

  return (
    <>
      <Sidebar />
      <Navbar />
      <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
        py: 5,
      }}
    >
      <Container maxWidth="md">

        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
        >
          Student Submissions
        </Typography>

        {submissions.length === 0 ? (
          <Typography>
            Belum ada submission.
          </Typography>
        ) : (
          submissions.map((item) => (
            <Card
              key={item.id}
              sx={{
                mb: 3,
                cursor: "pointer",
                transition: ".2s",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              onClick={() =>
                router.push(
                  `/teacher/submission/${item.id}`
                )
              }
            >
              <CardContent>

                <Typography fontWeight="bold">
                  Student ID : {item.student_id}
                </Typography>

                <Typography
                  color="text.secondary"
                  mt={1}
                >
                  Submission #{item.id}
                </Typography>

                <Typography
                  mt={2}
                  color="#2563EB"
                  fontWeight="bold"
                >
                  View Detail →
                </Typography>

              </CardContent>
            </Card>
          ))
        )}

      </Container>
    </Box>
    </>
  );
}