"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { profile } from "@/services/auth";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const user = await profile(token);

      if (user.role === "teacher") {
        router.push("/teacher");
      } else {
        router.push("/student");
      }
    }

    checkUser();
  }, [router]);

  return <h1>Loading...</h1>;
}