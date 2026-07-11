"use client";

import { Button } from "@mui/material";

export default function PrimaryButton(props: any) {
  return (
    <Button
      variant="contained"
      sx={{
        borderRadius: 3,
        textTransform: "none",
        px: 4,
        py: 1.2,
        fontWeight: 600,
      }}
      {...props}
    />
  );
}