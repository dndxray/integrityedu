"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fraunces, IBM_Plex_Mono, Poppins } from "next/font/google";

import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

// import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { createClass } from "@/services/class";

// Font & warna disamain persis sama TeacherPage biar satu tema (bukan
// sans-serif default MUI polos).
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ink = "#0B2545";
const steel = "#2C6E9E";
const slate = "#5B6B82";
const line = "#D9E3F0";

export default function CreateClassPage() {
  const router = useRouter();

  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreate() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    const result = await createClass(token, {
      class_name: className,
      description,
    });

    if (result.id) {
      alert("Kelas berhasil dibuat.");
      router.push("/teacher");
    } else {
      alert(result.detail || "Gagal membuat kelas.");
    }
  }

  return (
    <>
      <Sidebar />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#EAF4FF",
          ml: { xs: 0, md: "260px" },
          p: { xs: 1.5, md: 3 },
        }}
      >
        <Box
          className={poppins.className}
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            minHeight: { md: "calc(100vh - 48px)" },
            boxShadow: "0 20px 45px -20px rgba(51,70,196,0.15)",
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Typography
            className={fraunces.className}
            sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 600, fontStyle: "italic", color: ink }}
          >
            Create Class
          </Typography>

          <Typography sx={{ color: slate, mt: 1, mb: 4, maxWidth: 520 }}>
            Buat kelas baru dan undang murid pakai kode kelas yang dibuat.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.3fr 1fr" },
              gap: 3,
              alignItems: "start",
            }}
          >
            {/* Form */}
            <Box
              sx={{
                border: `1px solid ${line}`,
                borderRadius: "4px 20px 4px 4px",
                p: { xs: 2.5, md: 3.5 },
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="Class Name"
                  placeholder="Example: Mobile Programming"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      "& fieldset": { borderColor: line },
                      "&:hover fieldset": { borderColor: steel },
                      "&.Mui-focused fieldset": { borderColor: steel },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  label="Description"
                  placeholder="Write a short description about this class..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      "& fieldset": { borderColor: line },
                      "&:hover fieldset": { borderColor: steel },
                      "&.Mui-focused fieldset": { borderColor: steel },
                    },
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "flex-end",
                    gap: 1.5,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => router.back()}
                    sx={{
                      textTransform: "none",
                      borderRadius: 1.5,
                      borderColor: line,
                      color: ink,
                      fontWeight: 600,
                      "&:hover": { borderColor: steel, bgcolor: "#F6FAFE" },
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleCreate}
                    sx={{
                      textTransform: "none",
                      borderRadius: 1.5,
                      px: 4,
                      bgcolor: ink,
                      fontWeight: 700,
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#0A1F3D", boxShadow: "none" },
                    }}
                  >
                    Create Class
                  </Button>
                </Box>
              </Box>
            </Box>            
          </Box>
        </Box>
      </Box>
    </>
  );
}