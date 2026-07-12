"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
//import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export default function StudentSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

  // Path & logout logic tetap sama seperti sebelumnya, cuma tambah 2 menu
  // baru (My Classes & Assignments) mengikuti tampilan di desain.
  const menus = [
    {
      label: "Dashboard",
      path: "/student",
      icon: <HomeOutlinedIcon fontSize="small" />,
    },
    // {
    //   label: "Join Class",
    //   path: "/student/join-class",
    //   icon: <PersonOutlineOutlinedIcon fontSize="small" />,
    // },
    {
      label: "My Classes",
      path: "/student/my-classes",
      icon: <MenuBookOutlinedIcon fontSize="small" />,
    },
    // {
    //   label: "Assignments",
    //   path: "/student/assignment",
    //   icon: <AssignmentOutlinedIcon fontSize="small" />,
    // },
  ];

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const sidebarContent = (
    <Box
      className={poppins.className}
      sx={{
        width: 260,
        height: "100%",
        bgcolor: "#EAF4FF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2.5,
        }}
      >

        <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <SchoolRoundedIcon
          // color="primary"
          fontSize="large"
          sx={{
            color: "#64748b"
          }}
        />

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700, color: "#64748b"
          }}
        >
          IntegrityEdu
        </Typography>
      </Box>
      </Box>

      <Divider sx={{ mx: 3, borderColor: "#D9E7F5" }} />

      <Stack spacing={2} sx={{ px: 2.5, py: 3 }}>
        {menus.map((menu) => {
          const active = pathname === menu.path;

          return (
            <Box
              key={menu.path}
              onClick={() => {
                router.push(menu.path);

                if (mobile) {
                  setOpen(false);
                }
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 1.4,
                borderRadius: 1.5,
                cursor: "pointer",
                color: active ? "#173c70" : "#64748b",
                transition: "color 0.15s ease",
                "&:hover": {
                  color: active ? "#173c70" : "#64748b",
                },
              }}
            >
              {/* home */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: active ? "#64748b" : "inherit",
                }}
              >
                {menu.icon}
              </Box>

              <Typography
                variant="body2"
                sx={{
                fontSize: 16.5,
                fontWeight: active ? 700 : 600,
                color: "#64748b"
              }}
              >
                {menu.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      <Box
        sx={{
          mt: "auto",
          px: 2.5,
          pb: 3,
        }}
      >
        <Box
          onClick={logout}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 1.4,
            borderRadius: 1.5,
            cursor: "pointer",
            color: "#e01515",
            "&:hover": {
              color: "#DC2626",
            },
          }}
        >
          <LogoutOutlinedIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontSize: 14.5, fontWeight: 900, color: "inherit" }}>
            Logout
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {mobile ? (
        <>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              position: "fixed",
              top: 12,
              left: 12,
              zIndex: 1400,
              bgcolor: "#EEF0FB",
              boxShadow: 2,
            }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Drawer open={open} onClose={() => setOpen(false)}>
            {sidebarContent}
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            top: 0,
            width: 260,
            height: "100vh",
            borderRight: "1px solid #4e7ba8",
            bgcolor: "#EEF0FB",
            zIndex: 1300,
          }}
        >
          {sidebarContent}
        </Box>
      )}
    </>
  );
}