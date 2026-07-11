"use client";

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import { useTheme } from "@mui/material/styles";

export default function Navbar() {
  const theme = useTheme();

  const mobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "black",
        borderBottom: "1px solid #E5E7EB",

        ml: {
          xs: 0,
          md: 260,
        },

        width: {
          xs: "100%",
          md: "calc(100% - 260)",
        },
        boxSizing: "border-box",
      }}
    >
      <Toolbar
  sx={{
    minHeight: "64px !important",
    height: 64,
    display: "flex",
    justifyContent: "space-between",
  }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {mobile && (
            <Box
              sx={{
                width: 35,
              }}
            />
          )}

          {/* <Typography
            variant="h6"
            fontWeight="bold"
          >
            IntegrityEdu
          </Typography> */}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {!mobile && (
            <Typography color="text.secondary">
              Welcome
            </Typography>
          )}

          <Avatar
            sx={{
              bgcolor: "#2563EB",
            }}
          >
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}