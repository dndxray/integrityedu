"use client";

import { Card, CardContent } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AppCard({
  children,
}: Props) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 2,
        transition: ".2s",

        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}