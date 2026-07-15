"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

import { createAssignment } from "@/services/assignment";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";


export default function CreateAssignmentPage() {
  const router = useRouter();
  const params = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  async function handleSubmit() {
    const token = localStorage.getItem("token");

    if (!token) return;

    const result = await createAssignment(token, {
      class_id: Number(params.id),
      title,
      description,
      deadline,
    });

    if (result.id) {
      alert("Assignment berhasil dibuat");

      router.push(`/teacher/class/${params.id}`);
    } else {
      alert(result.detail);
    }
  }
  return (
    <>
      <Sidebar />
      <Navbar/>
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
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Typography
              variant="h4" sx={{ fontWeight: "bold", mt: 1,mb :3 }}
              
            >
              Create Assignment
            </Typography>
            <Stack spacing={3}>
              <TextField
                label="Title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
              />
              <TextField
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
              />
              <TextField
                type="datetime-local"
                value={deadline}
                onChange={(e)=>setDeadline(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                Create Assignment
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
      </Box>
    </Box>
    </>
  );
}