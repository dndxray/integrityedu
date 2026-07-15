"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";

import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Toolbar,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded"; 
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const ink = "#0B2545";
const steel = "#2C6E9E";
const line = "#D9E3F0";

export default function StudentNavbar() {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    handleCloseMenu();
  };

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
    handleCloseMenu();
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className={poppins.className}
      sx={{
        bgcolor: "white",
        color: ink,
        borderBottom: `1px solid ${line}`,
        width: "100%",
        top: 0,
        boxSizing: "border-box",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: { xs: "block", md: "none" }, // Hanya muncul di HP
      }}
    >
      <Toolbar
        sx={{
          minHeight: "64px !important",
          height: 64,
          display: "flex",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        {/* KIRI: Tombol Back */}
        <IconButton
          onClick={() => router.back()}
          edge="start"
          sx={{
            color: ink,
            border: `1px solid ${line}`,
            borderRadius: 1.5,
            p: 1,
            "&:hover": { bgcolor: "#F6FAFE", borderColor: steel },
          }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>

        {/* TENGAH: Nama Aplikasi */}
        <Typography sx={{ fontWeight: 700, fontSize: 18, color: ink, letterSpacing: -0.3 }}>
          IntegrityEdu
        </Typography>

        {/* KANAN: Menu Dropdown */}
        <Box>
          <IconButton
            onClick={handleOpenMenu}
            edge="end"
            sx={{
              color: ink,
              border: `1px solid ${line}`,
              borderRadius: 1.5,
              p: 1,
              "&:hover": { bgcolor: "#F6FAFE", borderColor: steel },
            }}
          >
            <MoreVertRoundedIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  boxShadow: "0 10px 25px -5px rgba(51,70,196,0.12)",
                  border: `1px solid ${line}`,
                  minWidth: 180,
                  p: 0.5,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* RUTE DIUBAH KHUSUS STUDENT */}
            <MenuItem 
              onClick={() => handleNavigate("/student")}
              sx={{ py: 1.2, borderRadius: 1.5, gap: 1, color: ink, fontWeight: 600, fontSize: 14 }}
            >
              <ListItemIcon sx={{ color: steel }}><HomeOutlinedIcon fontSize="small" /></ListItemIcon>
              Dashboard
            </MenuItem>

            <MenuItem 
              onClick={() => handleNavigate("/student/my-classes")}
              sx={{ py: 1.2, borderRadius: 1.5, gap: 1, color: ink, fontWeight: 600, fontSize: 14 }}
            >
              <ListItemIcon sx={{ color: steel }}><MenuBookOutlinedIcon fontSize="small" /></ListItemIcon>
              My Classes
            </MenuItem>

            {/* OPSI LOGOUT */}
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                py: 1.2, 
                borderRadius: 1.5, 
                gap: 1, 
                color: "#e01515", 
                fontWeight: 700, 
                fontSize: 14,
                borderTop: `1px solid ${line}`,
                mt: 0.5,
                pt: 1.5,
                "&:hover": { color: "#DC2626" }
              }}
            >
              <ListItemIcon sx={{ color: "#e01515" }}><LogoutOutlinedIcon fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}