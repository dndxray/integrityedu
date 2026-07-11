"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

  const menus = [
    {
      label: "Dashboard",
      path: "/teacher",
      icon: <DashboardRoundedIcon />,
    },
    {
      label: "Create Class",
      path: "/teacher/create-class",
      icon: <AddRoundedIcon />,
    },
    // {
    //   label: "Analytics",
    //   path: "/teacher/analytics",
    //   icon: <BarChartRoundedIcon />,
    // },
  ];

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  

const sidebarContent = (
  <Box
    sx={{
      width: 260,
      height: "100%",
      bgcolor: "white",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Header */}
    <Box
  sx={{
    px: 3,
    height: 64,
    display: "flex",
    alignItems: "center",
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
          color="primary"
          fontSize="large"
        />

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          IntegrityEdu
        </Typography>
      </Box>

      {/* <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 0.5,
        }}
      >
        Teacher Panel
      </Typography> */}
    </Box>

    <Divider />

    {/* Menu */}
    <Stack
      spacing={1}
      sx={{
        p: 2,
        flex: 1,
      }}
    >
      {menus.map((menu) => (
        <Button
          key={menu.path}
          fullWidth
          startIcon={menu.icon}
          variant={
            pathname === menu.path
              ? "contained"
              : "text"
          }
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            borderRadius: 3,
            py: 1.4,
            fontWeight: 600,
          }}
          onClick={() => {
            router.push(menu.path);

            if (mobile) {
              setOpen(false);
            }
          }}
        >
          {menu.label}
        </Button>
      ))}
    </Stack>

    <Divider />

    {/* Footer */}
    <Box
      sx={{
        p: 2,
      }}
    >
      <Button
        fullWidth
        color="error"
        startIcon={<LogoutRoundedIcon />}
        sx={{
          justifyContent: "flex-start",
          textTransform: "none",
          borderRadius: 3,
          py: 1.3,
        }}
        onClick={logout}
      >
        Logout
      </Button>
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
              bgcolor: "white",
              boxShadow: 2,
            }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Drawer
            open={open}
            onClose={() => setOpen(false)}
          >
            {sidebarContent}
          </Drawer>
        </>
      ) : (
        <Box
  sx={{
    position: "fixed",
    top: 0,
    left: 0,
    width: 260,
    height: "100vh",
    bgcolor: "white",
    borderRight: 0,
    zIndex: 1200,
  }}
>
          {sidebarContent}
        </Box>
      )}
    </>
  );
}