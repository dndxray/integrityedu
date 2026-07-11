"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { getSubmissionDetail } from "@/services/submission";
import { getTypingLog } from "@/services/typing";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function SubmissionDetailPage() {
  const params = useParams();

  const [submission, setSubmission] = useState<any>(null);
  const [typing, setTyping] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");

      if (!token) return;

      const submissionData = await getSubmissionDetail(
        token,
        Number(params.id)
      );

      setSubmission(submissionData);

      const typingData = await getTypingLog(
        token,
        Number(params.id)
      );

      setTyping(typingData);
    }

    load();
  }, [params.id]);

  if (!submission) {
    return (
      <Typography sx={{ mt: 5, textAlign: "center" }}>
        Loading...
      </Typography>
    );
  }

  const overall =
    typing
      ? Math.round(
          submission.ai_score * 0.6 +
            typing.risk_score * 0.4
        )
      : submission.ai_score;

  const chipColor =
    overall >= 70
      ? "error"
      : overall >= 30
      ? "warning"
      : "success";

  const status =
    overall >= 70
      ? "High Risk"
      : overall >= 30
      ? "Medium Risk"
      : "Low Risk";

    return (
    <>
        <Sidebar />
        <Navbar />
        <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FB",
        py: 5,
      }}
    >
      <Container maxWidth="lg"            
      sx={{
            ml: {
              xs: 0,
              md: "280px",
            },
            pt: {
              xs: 9,
              md: 10,
            },
            pb: 5,
            px: {
                    xs: 2,
              md: 0,
            },
          }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
        >
          Submission Analysis
        </Typography>

        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 8 }}>

            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 2,
              }}
            >
              <CardContent>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Student Answer
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography
                  color="text.secondary"
                  mb={1}
                >
                  Student ID
                </Typography>

                <Typography fontWeight="bold">
                  {submission.student_id}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography
                  color="text.secondary"
                  mb={1}
                >
                  Essay
                </Typography>

                <Typography
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.8,
                  }}
                >
                  {submission.answer}
                </Typography>

              </CardContent>
            </Card>

          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>

            <Stack spacing={3}>

              <Card
                sx={{
                  borderRadius: 4,
                }}
              >
                <CardContent>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    Overall Integrity
                  </Typography>

                  <Chip
                    sx={{
                      mt: 2,
                    }}
                    color={chipColor}
                    label={`${overall}%`}
                  />

                  <Typography
                    mt={2}
                    fontWeight="bold"
                  >
                    {status}
                  </Typography>

                </CardContent>
              </Card>

              <Card
                sx={{
                  borderRadius: 4,
                }}
              >
                <CardContent>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    AI Analysis
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography color="text.secondary">
                    AI Score
                  </Typography>

                  <Chip
                    sx={{ mt: 1 }}
                    color={
                      submission.ai_score >= 70
                        ? "error"
                        : submission.ai_score >= 30
                        ? "warning"
                        : "success"
                    }
                    label={`${submission.ai_score}%`}
                  />

                  <Typography
                    mt={3}
                    color="text.secondary"
                  >
                    Result
                  </Typography>

                  <Typography fontWeight="bold">
                    {submission.ai_result}
                  </Typography>

                  <Typography
                    mt={3}
                    color="text.secondary"
                  >
                    Reason
                  </Typography>

                  <Typography>
                    {submission.ai_reason}
                  </Typography>

                  <Typography
                    mt={3}
                    color="text.secondary"
                  >
                    Recommendation
                  </Typography>

                  <Typography>
                    {submission.ai_recommendation}
                  </Typography>

                </CardContent>
              </Card>

              {typing && (

                <Card
                  sx={{
                    borderRadius: 4,
                  }}
                >
                  <CardContent>

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      Typing Behavior
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1.5}>

                      <Typography>
                        Word Count : <b>{typing.word_count}</b>
                      </Typography>

                      <Typography>
                        Typing Time :{" "}
                        <b>{typing.typing_time}s</b>
                      </Typography>

                      <Typography>
                        Average WPM :{" "}
                        <b>{typing.average_wpm}</b>
                      </Typography>

                      <Typography>
                        Paste :{" "}
                        <b>{typing.paste_count}</b>
                      </Typography>

                      <Typography>
                        Tab Switch :{" "}
                        <b>{typing.tab_switch}</b>
                      </Typography>

                      <Typography>
                        Pause :{" "}
                        <b>{typing.pause_count}</b>
                      </Typography>

                      <Typography>
                        Idle :{" "}
                        <b>{typing.idle_time}s</b>
                      </Typography>

                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                      color="text.secondary"
                    >
                      Typing Risk
                    </Typography>

                    <Chip
                      sx={{
                        mt: 1,
                      }}
                      color={
                        typing.risk_score >= 70
                          ? "error"
                          : typing.risk_score >= 30
                          ? "warning"
                          : "success"
                      }
                      label={`${typing.risk_score}%`}
                    />

                  </CardContent>
                </Card>

              )}

            </Stack>

          </Grid>
        </Grid>
      </Container>
    </Box>
    </>
  );
}