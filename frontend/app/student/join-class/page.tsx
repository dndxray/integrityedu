"use client";

import { useRouter } from "next/navigation";

import JoinClassModal from "@/components/JoinClassModal";

export default function JoinClassPage() {
  const router = useRouter();

  return (
    <JoinClassModal
      open
      onClose={() => router.back()}
      onJoined={() => router.refresh()}
    />
  );
}