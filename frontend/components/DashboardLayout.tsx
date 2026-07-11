"use client";

import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  title: string;
  children: ReactNode;
}

export default function DashboardLayout({
  title,
  children,
}: Props) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FB",
      }}
    >
      <Box
        sx={{
          height: 70,
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 5,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#2563EB" }}
        >
          IntegrityEdu
        </Typography>

        <Typography
          color="text.secondary"
        >
          Learning Management System
        </Typography>
      </Box>

      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          py: 5,
          px: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          {title}
        </Typography>

        {children}
      </Box>
    </Box>
  );
}