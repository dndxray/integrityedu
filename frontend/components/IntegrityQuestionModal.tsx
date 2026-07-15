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

// Tambahkan ikon centang sukses
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

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
  const [answers, setAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [isSuccess, setIsSuccess] = useState(false); // State untuk mengontrol tampilan centang sukses

  useEffect(() => {
    if (open) {
      setAnswers(["", "", "", "", ""]);
      setIsSuccess(false); // Reset status sukses saat modal dibuka kembali
    }
  }, [open]);

  function updateAnswer(index: number, value: string) {
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

  // Handle ketika tombol Submit Final ditekan
  const handleFinalSubmit = () => {
    setIsSuccess(true); // Ubah tampilan menjadi centang sukses
    
    // Beri jeda 2 detik untuk animasi centang sukses sebelum mengirim data dan menutup modal
    setTimeout(() => {
      onSubmit(answers);
    }, 2000);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 700, color: "#0B2545" }}>
        {isSuccess ? "" : "Integrity Check"}
      </DialogTitle>

      <DialogContent>
        {isSuccess ? (
          // ====== TAMPILAN POP-UP JADI CENTANG SUKSES ======
          <Box
            sx={{
              py: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2.5,
              textAlign: "center",
            }}
          >
            <CheckCircleRoundedIcon 
              sx={{ 
                fontSize: 80, 
                color: "#22C55E",
                animation: "scaleUp 0.3s ease-in-out",
                "@keyframes scaleUp": {
                  "0%": { transform: "scale(0)" },
                  "100%": { transform: "scale(1)" }
                }
              }} 
            />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#0B2545", mb: 1 }}>
                Submit Berhasil!
              </Typography>
              <Typography sx={{ color: "#5B6B82", fontSize: 15 }}>
                Jawaban verifikasi integritas Anda telah direkam oleh sistem AI.
              </Typography>
            </Box>
            <CircularProgress size={24} sx={{ mt: 2, color: "#2C6E9E" }} />
          </Box>
        ) : (
          // ====== TAMPILAN PERTANYAAN ASLI KELUAR ======
          <>
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              <strong>Jangan meninggalkan halaman ini.</strong>
              <br />
              Seluruh aktivitas seperti berpindah tab, copy-paste, dan waktu mengetik akan dicatat.
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
                <Typography>AI sedang membuat pertanyaan...</Typography>
              </Box>
            ) : questions.length === 0 ? (
              <Typography align="center" variant="body1" sx={{ color: "text.secondary", py: 5 }}>
                Tidak ada pertanyaan yang diterima.
              </Typography>
            ) : (
              <Stack spacing={3}>
                {questions.map((question, index) => (
                  <Box key={index}>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, color: "#0B2545" }}>
                      {index + 1}. {question}
                    </Typography>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="Tulis jawaban..."
                      value={answers[index] ?? ""}
                      onChange={(e) => updateAnswer(index, e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
                disabled={loading || !canSubmit}
                onClick={handleFinalSubmit}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#3346C4",
                  boxShadow: "none",
                  px: 4,
                  "&:hover": { bgcolor: "#26339C", boxShadow: "none" },
                }}
              >
                Submit Final
              </Button>
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}