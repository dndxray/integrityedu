"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { login } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  async function handleLogin() {
    const result = await login({
      email,
      password,
    });

    if (!result.access_token) {
      alert("Email atau password salah");
      return;
    }

    localStorage.setItem(
      "token",
      result.access_token
    );

    router.push("/loading");
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Card
  sx={{
    width: "100%",
    maxWidth: 1200,
    minHeight: 720,
    display: "flex",
    flexDirection: {
      xs: "column",
      md: "row",
    },
    overflow: "hidden",
    borderRadius: 5,
    boxShadow:
      "0 25px 70px rgba(15,23,42,.08)",
  }}
>
  <Box
    sx={{
      width: {
        xs: "100%",
        md: "42%",
      },
      display: {
        xs: "none",
        md: "flex",
      },
      p: 6,
      color: "white",
      position: "relative",
      overflow: "hidden",
      background:
        "linear-gradient(160deg, #6C8DFF 0%, #7CB8FF 50%, #B7F5D8 100%)",

      "&::before": {
        content: '""',
        position: "absolute",
        width: 420,
        height: 420,
        borderRadius: "50%",
        top: -180,
        right: -120,
        background: "rgba(255,255,255,.12)",
        filter: "blur(20px)",
      },

      "&::after": {
        content: '""',
        position: "absolute",
        width: 520,
        height: 520,
        borderRadius: "50%",
        bottom: -250,
        left: -180,
        background: "rgba(255,255,255,.10)",
        filter: "blur(30px)",
      },
    }}
  >
    {/* Logo */}
    <Typography
      sx={{
        position: "absolute",
        top: 55,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: 18,
        fontWeight: 600,
        zIndex: 2,
      }}
    >
      IntegrityEdu
    </Typography>

    {/* Judul */}
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        zIndex: 2,
        width: "100%",
      }}
    >
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: 56,
          lineHeight: 1.35,
        }}
      >
        Halo,
        <br />
        Selamat
        <br />
        Datang!
      </Typography>
    </Box>
  </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#FFFFFF",
            p: {
              xs: 4,
              md: 7,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 460,
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography
                  fontWeight={600}
                  mb={1}
                >
                  Email
                </Typography>

                <TextField
                  fullWidth
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root":
                      {
                        borderRadius: 4,
                        bgcolor: "#FAFBFD",
                      },
                  }}
                />
              </Box>

              <Box>
                <Typography
                  fontWeight={600}
                  mb={1}
                >
                  Password
                </Typography>

                <TextField
                  fullWidth
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Masukkan password kamu"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon />
                          ) : (
                            <VisibilityOutlinedIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root":
                      {
                        borderRadius: 4,
                        bgcolor: "#FAFBFD",
                      },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                    />
                  }
                  label="Ingat saya"
                />

                <Typography
                  sx={{
                    color: "#7DA2F8",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Lupa password?
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
                sx={{
                  py: 1.8,
                  borderRadius: 4,
                  fontWeight: 700,
                  fontSize: 16,
                  textTransform: "none",
                  color: "#fff",

                  background:
                    "linear-gradient(90deg, #6A8FFF 0%, #78A9FF 30%, #88C9FF 65%, #AEEFD9 100%)",
                  boxShadow:
                    "0 10px 25px rgba(137, 251, 255, 0.35)",

                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #6C8DFF 0%, #79AAFF 25%, #89C8FF 55%, #9DDDEB 80%, #B7F5D8 100%)",
                  },
                }}
              >
                Masuk
              </Button>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    height: 1,
                    bgcolor: "#E5E7EB",
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    height: 1,
                    bgcolor: "#E5E7EB",
                  }}
                />
              </Box>
              <Typography
                align="center"
                color="text.secondary"
              >
                Belum punya akun?{" "}
                <Link
                  component="button"
                  underline="none"
                  onClick={() =>
                    router.push(
                      "/register"
                    )
                  }
                  sx={{
                    color: "#7DA2F8",
                    fontWeight: 700,
                  }}
                >
                  Daftar sekarang
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}