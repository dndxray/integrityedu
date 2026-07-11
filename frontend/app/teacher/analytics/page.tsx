"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getDashboardAnalytics } from "@/services/analytics";

const statCardStyle = {
  classes: { bg: "#EEF2FF", fg: "#4338CA" },
  assignments: { bg: "#ECFDF5", fg: "#059669" },
  students: { bg: "#FFF7ED", fg: "#C2410C" },
  submissions: { bg: "#FEF2F2", fg: "#DC2626" },
};

function StatCard({
  label,
  value,
  icon,
  colors,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  colors: {
    bg: string;
    fg: string;
  };
}) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #EEF0F3",
        boxShadow: "0 1px 3px rgba(15,23,42,.08)",
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: colors.bg,
              color: colors.fg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: 13,
              }}
            >
              {label}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");

      if (!token) return;

      const result = await getDashboardAnalytics(token);

      setData(result);
    }

    load();
  }, []);

  if (!data) {
    return (
      <>
        <Sidebar />
        <Navbar />

        <Box
          sx={{
            ml: {
              xs: 0,
              md: "260px",
            },
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F7F9FC",
        }}
      >
        <Container
          maxWidth={false}
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
              md: 4,
            },
            maxWidth:{
              md:"calc(100vw - 280px)"
              
            }
          }}
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Box
              sx={{
                mb: 5,
              }}
            >
              <Stack
  sx={{
    flexDirection: {
      xs: "column",
      md: "row",
    },
    justifyContent: "space-between",
    alignItems: {
      xs: "flex-start",
      md: "center",
    },
    gap: 2,
    mb: 4,
  }}
>
  <Box>
    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
      }}
    >
      Analytics Dashboard
    </Typography>

    <Typography
      color="text.secondary"
      sx={{
        mt: 0.5,
      }}
    >
      Monitor your classroom statistics and integrity overview.
    </Typography>
  </Box>
</Stack>

<Grid
  container
  spacing={2.5}
  sx={{
    mb: 4,
  }}
>
  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
    <StatCard
      label="Classes"
      value={data?.total_classes ?? 0}
      icon={<SchoolRoundedIcon />}
      colors={statCardStyle.classes}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
    <StatCard
      label="Assignments"
      value={data?.total_assignments ?? 0}
      icon={<AssignmentRoundedIcon />}
      colors={statCardStyle.assignments}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
    <StatCard
      label="Students"
      value={data?.total_students ?? 0}
      icon={<GroupsRoundedIcon />}
      colors={statCardStyle.students}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
    <StatCard
      label="Submissions"
      value={data?.total_submissions ?? 0}
      icon={<DescriptionRoundedIcon />}
      colors={statCardStyle.submissions}
    />
  </Grid>
</Grid>
</Box> 

            <Grid
              container
              spacing={3}
              sx={{
                mt: 1,
              }}
            >
              <Grid size={{ xs: 12, lg: 6 }}>
  <Card
    sx={{
      borderRadius: 4,
      height: "100%",
      boxShadow: "0 2px 10px rgba(0,0,0,.05)",
    }}
  >
    <CardContent
      sx={{
        p: 3,
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          AI Risk Summary
        </Typography>

        <TrendingUpRoundedIcon color="primary" />
      </Stack>

      <Stack spacing={3}>
        <Box>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Low Risk</Typography>

            <Typography
              sx={{
                fontWeight: 700,
                color: "#16A34A",
              }}
            >
              {data.low_risk}
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={Math.min(data.low_risk * 10, 100)}
            color="success"
            sx={{
              height: 8,
              borderRadius: 5,
            }}
          />
        </Box>

        <Box>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Medium Risk</Typography>

            <Typography
              sx={{
                fontWeight: 700,
                color: "#F59E0B",
              }}
            >
              {data.medium_risk}
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={Math.min(data.medium_risk * 10, 100)}
            color="warning"
            sx={{
              height: 8,
              borderRadius: 5,
            }}
          />
        </Box>

        <Box>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>High Risk</Typography>

            <Typography
              sx={{
                fontWeight: 700,
                color: "#DC2626",
              }}
            >
              {data.high_risk}
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={Math.min(data.high_risk * 10, 100)}
            color="error"
            sx={{
              height: 8,
              borderRadius: 5,
            }}
          />
        </Box>
      </Stack>
    </CardContent>
  </Card>
</Grid>

<Grid size={{ xs: 12, lg: 6 }}>
  <Card
    sx={{
      borderRadius: 4,
      height: "100%",
      boxShadow: "0 2px 10px rgba(0,0,0,.05)",
    }}
  >
    <CardContent
      sx={{
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Average Statistics
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography color="text.secondary">
                Average AI Score
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 1,
                  fontWeight: 700,
                }}
              >
                {data.average_ai_score}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography color="text.secondary">
                Average Typing Risk
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 1,
                  fontWeight: 700,
                }}
              >
                {data.average_typing_risk}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography color="text.secondary">
                Average WPM
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 1,
                  fontWeight: 700,
                }}
              >
                {data.average_wpm}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
</Grid>
</Grid>

</Box>

</Container>

</Box>

</>

);

}