"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { createClass } from "@/services/class";

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
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F8FAFC",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            ml: {
              xs: 0,
              md: "280px",
            },
            pt: {
              xs: 10,
              md: 12,
            },
            pb: 5,
            px: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            Create Class
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              mb: 4,
            }}
          >
            Create a new class and invite students using the generated class
            code.
          </Typography>

          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #E5E7EB",
              boxShadow: "0 2px 8px rgba(15,23,42,.05)",
            }}
          >
            <CardContent
              sx={{
                p: 4,
              }}
            >
              <Stack
                spacing={3}
              >
                <TextField
                  fullWidth
                  label="Class Name"
                  placeholder="Example: Mobile Programming"
                  value={className}
                  onChange={(e) =>
                    setClassName(e.target.value)
                  }
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  label="Description"
                  placeholder="Write a short description about this class..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={2}
                  sx={{
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                    onClick={() =>
                      router.back()
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      px: 4,
                    }}
                    onClick={handleCreate}
                  >
                    Create Class
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}