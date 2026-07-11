"use client";

import { useState } from "react";

import {
  Alert,
  Backdrop,
  Button,
  Fade,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { joinClass } from "@/services/student";

interface JoinClassModalProps {
  open: boolean;
  onClose: () => void;
  // Dipanggil setelah berhasil join, biar halaman yang manggil bisa
  // refetch data kelasnya sendiri (dashboard, my classes, dll).
  onJoined?: () => void;
}

export default function JoinClassModal({
  open,
  onClose,
  onJoined,
}: JoinClassModalProps) {
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      setLoading(true);

      await joinClass(token, classCode);

      setSuccess(true);
      setClassCode("");
      onJoined?.();

      // Modal ditutup setelah kasih waktu user lihat pesan sukses.
      // Nggak ada router.push lagi — halaman di belakangnya (dashboard,
      // my classes, dll) tetap sama, cuma data-nya udah ke-refresh.
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      setError("Class code not found.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setClassCode("");
    setError("");
    onClose();
  }

  return (
    <>
      <Backdrop
        open={open}
        sx={{
          zIndex: 2000,
          backdropFilter: "blur(10px)",
          bgcolor: "rgba(15,23,42,.30)",
        }}
        onClick={handleClose}
      >
        <Fade in={open} timeout={250}>
          <Paper
            elevation={0}
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: {
                xs: "92%",
                sm: 460,
              },
              borderRadius: 3,
              p: 4,
              position: "relative",
              boxShadow: "0 20px 60px rgba(15,23,42,.18)",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 18,
                top: 18,
              }}
            >
              <CloseRoundedIcon />
            </IconButton>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              Bergabung ke Kelas
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mb: 4,
              }}
            >
              Masukkan kode kelas dari guru
            </Typography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                placeholder="Contoh : MTK-2024"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#F8FAFC",
                  },
                }}
              />

              <Button
                fullWidth
                size="large"
                variant="contained"
                disabled={loading || !classCode}
                onClick={handleJoin}
                sx={{
                  borderRadius: 2,
                  height: 50,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {loading ? "Bergabung..." : "Bergabung Sekarang"}
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Backdrop>

      <Snackbar
        open={success}
        autoHideDuration={1800}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Berhasil bergabung ke kelas.</Alert>
      </Snackbar>

      <Snackbar
        open={error !== ""}
        autoHideDuration={2200}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </>
  );
}