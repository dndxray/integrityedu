"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  questions: string[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (answers: string[]) => void;
}

export default function IntegrityQuestionModal({
  open,
  questions,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [answers, setAnswers] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);

  useEffect(() => {
    if (open) {
      setAnswers([
        "",
        "",
        "",
        "",
        "",
      ]);
    }
  }, [open]);

  function updateAnswer(
    index: number,
    value: string
  ) {
    const copy = [...answers];

    copy[index] = value;

    setAnswers(copy);
  }

  const canSubmit = useMemo(() => {
    if (questions.length === 0) return false;

    return answers
      .slice(0, questions.length)
      .every((answer) => answer.trim() !== "");
  }, [answers, questions]);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
        }}
      >
        Integrity Check
      </DialogTitle>

      <DialogContent>

        <Alert
          severity="warning"
          sx={{ mb: 3 }}
        >
          <strong>Jangan meninggalkan halaman ini.</strong>
          <br />
          Seluruh aktivitas seperti berpindah tab,
          copy-paste, dan waktu mengetik akan dicatat.
        </Alert>

        {loading ? (

          <Box
            sx={{
              py: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress />

            <Typography>
              AI sedang membuat pertanyaan...
            </Typography>

          </Box>

        ) : questions.length === 0 ? (

          <Typography
            align="center"
            variant="body1"
            sx={{ color: "text.secondary", py: 5 }}
          >
            Tidak ada pertanyaan yang diterima.
          </Typography>

        ) : (

          <Stack spacing={3}>

            {questions.map((question, index) => (

              <Box key={index}>

                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  {index + 1}. {question}
                </Typography>

                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Tulis jawaban..."
                  value={answers[index] ?? ""}
                  onChange={(e) =>
                    updateAnswer(
                      index,
                      e.target.value
                    )
                  }
                />

              </Box>

            ))}

          </Stack>

        )}

        <Divider sx={{ my: 4 }} />

        <Stack
        sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 2, 
      }}
      >
          <Button
            variant="contained"
            disabled={
              loading ||
              !canSubmit
            }
            onClick={() =>
              onSubmit(answers)
            }
          >
            Submit Final
          </Button>

        </Stack>

      </DialogContent>
    </Dialog>
  );
}