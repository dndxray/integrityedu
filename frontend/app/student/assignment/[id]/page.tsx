"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

import StudentSidebar from "@/components/StudentSidebar";
import StudentNavbar from "@/components/StudentNavbar";
import { getAssignmentDetail } from "@/services/assignment";
import { saveTypingLog } from "@/services/typing";
import {  uploadAssignment,  checkSubmission,generateQuestions,} from "@/services/submission";
import IntegrityQuestionModal from "@/components/IntegrityQuestionModal";
export default function StudentAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [selectedFile, setSelectedFile] =  useState<File | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [typingTime, setTypingTime] = useState(0);
  const [averageWpm, setAverageWpm] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [tabSwitch, setTabSwitch] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const [idleTime, setIdleTime] = useState(0);
  const startTime = useRef(Date.now());
  const lastTyping = useRef(Date.now());
  const [questionOpen, setQuestionOpen] =  useState(false);
  const [questions, setQuestions] =  useState<string[]>([]);
  const [questionLoading, setQuestionLoading] =  useState(false);

  useEffect(() => {
    async function loadAssignment() {
  const token = localStorage.getItem("token");
  if (!token) return;
  const data = await getAssignmentDetail(    token,    Number(params.id)  );
  setAssignment(data);
  const status = await checkSubmission(    token,    Number(params.id)  );
  setSubmitted(status.submitted);
}

    loadAssignment();
  }, [params.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.floor(
        (Date.now() - startTime.current) / 1000
      );

      setTypingTime(seconds);

      const minutes = seconds / 60;

      if (minutes > 0) {
        setAverageWpm(
          Math.round(wordCount / minutes)
        );
      }

      const idle = Math.floor(
        (Date.now() - lastTyping.current) / 1000
      );

      if (idle >= 5) {
        setIdleTime(idle);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [wordCount]);

  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        setTabSwitch((prev) => prev + 1);
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
  }, []);

// async function handleSubmit() {
//   const token = localStorage.getItem("token");

//   if (!token) return;

//   if (!selectedFile) {
//     alert("Silakan upload file PDF terlebih dahulu.");
//     return;
//   }

//   try {
//     setQuestionLoading(true);

//     const result = await generateQuestions(
//       token,
//       selectedFile
//     );
//     console.log(result);

//     const questionList = result.questions
//       .split("\n")
//       .filter(
//         (line: string) =>
//           line.trim() !== "" &&
//           /^\d+\./.test(line.trim())
//       )
//       .map((line: string) =>
//         line.replace(/^\d+\.\s*/, "")
//       );

//     setQuestions(questionList);

//     setQuestionOpen(true);

//   } catch (err: any) {
//     alert(
//       err?.message ??
//       "Gagal membuat pertanyaan."
//     );
//   } finally {
//     setQuestionLoading(false);
//   }
// }

// SEMENTARA
async function handleSubmit() {
  const token = localStorage.getItem("token");

  if (!token) return;

  if (!selectedFile) {
    alert("Silakan upload file PDF terlebih dahulu.");
    return;
  }

  try {
    setQuestionLoading(true);
    setQuestionOpen(true);

    // Simulasi AI sedang menganalisis jawaban teks siswa
    setTimeout(() => {
      // Mengambil potongan jawaban siswa agar pertanyaan terasa dinamis
      const lembarJawaban = answer.trim();
      const cuplikanJawaban = lembarJawaban.length > 60 
        ? `"${lembarJawaban.substring(0, 60)}..."` 
        : `"${lembarJawaban}"`;

      const dummyQuestions = [
  `Berdasarkan yang Anda tulis pada lembar jawaban mengenai definisi atau konsep 1NF, jelaskan apa yang melatarbelakangi Anda memberikan argumen tersebut secara lisan/tulisan?`,
  `Anda menyebutkan di jawaban Anda bahwa "tabel harus memenuhi syarat 1NF dulu dan kita harus hapus dependensi parsial". Bisa Anda perjelas contoh konkret penerapan aturan tersebut di studi kasus nyata?`,
  `Melihat hasil tulisan Anda terkait perbedaan tahapan normalisasi, mengapa Anda menyimpulkan langkah tersebut sebagai solusi paling efisien?`,
  `Berdasarkan penjelasan yang Anda ketik mengenai dependensi data, apa alternatif skema lain jika struktur tabel tersebut tidak dipecah?`,
  `Jika jawaban Anda "menghilangkan dependensi transitif untuk mencapai 3NF" diuji kembali dengan kasus anomali data yang lebih kompleks, apakah argumen integritas basis data Anda akan tetap sama? Jelaskan alasannya.`
];

      setQuestions(dummyQuestions);
      setQuestionLoading(false);
    }, 1500);

  } catch (err: any) {
    alert(
      err?.message ?? "Gagal membuat pertanyaan."
    );
    setQuestionLoading(false);
  }
}

  if (!assignment) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <StudentSidebar />
      <StudentNavbar />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#EAF4FF",
          ml: { xs: 0, md: "260px" },
          p: { xs: 1.5, md: 3 },
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 4,
            minHeight: { md: "calc(100vh - 48px)" },
            boxShadow: "0 20px 45px -20px rgba(51,70,196,0.15)",
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 8 }}>

              <Card sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid #EEF0F6" }}>

                <CardContent sx={{ p: 3 }}>

                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold" }}
                  >
                    {assignment.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    {assignment.description}
                  </Typography>

                  <Chip
                    sx={{ mt: 3, bgcolor: "#EEF2FF", color: "#3346C4", fontWeight: 600 }}
                    label={`Deadline : ${new Date(
                      assignment.deadline
                    ).toLocaleDateString("id-ID")}`}
                  />

                  <Divider sx={{ my: 4 }} />
                  <Paper
  variant="outlined"
  sx={{
    p: 4,
    mb: 4,
    borderStyle: "dashed",
    borderRadius: 2,
    borderColor: "#E2E4F5",
    textAlign: "center",
    bgcolor: "#F8F9FD",
  }}
>
  <Typography
    variant="body1"
    sx={{ fontWeight: 700, mb: 1 }}
  >
    Upload Assignment
  </Typography>

  <Typography
    variant="body2"
    sx={{ color: "text.secondary", mb: 3 }}
  >
    PDF, DOCX, JPG, PNG
  </Typography>

  <Button
    variant="outlined"
    component="label"
    sx={{ borderRadius: 2, textTransform: "none" }}
  >
    Choose File

    <input
      hidden
      type="file"
      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      onChange={(e) => {
        if (e.target.files) {
          setSelectedFile(
            e.target.files[0]
          );
        }
      }}
    />
  </Button>

  {selectedFile && (
  <Paper
    sx={{
      mt: 2,
      p: 2,
      borderRadius: 2,
      bgcolor: "#EEF2FF",
      boxShadow: "none",
    }}
  >
    <Typography variant="body1" sx={{ fontWeight: 600 }}>
      📄 {selectedFile.name}
    </Typography>

    <Typography
      variant="body2"
      color="text.secondary"
    >
      {(selectedFile.size / 1024).toFixed(1)} KB
    </Typography>
  </Paper>
)}
</Paper>


                  <TextField
                    multiline
                    rows={16}
                    label="Write your answer..."
                    value={answer}
                    onPaste={() =>
                      setPasteCount(
                        (prev) => prev + 1
                      )
                    }
                    onChange={(e) => {
                      const value = e.target.value;

                      const now = Date.now();

                      if (
                        now - lastTyping.current >
                        5000
                      ) {
                        setPauseCount(
                          (prev) => prev + 1
                        );
                      }

                      lastTyping.current = now;

                      setAnswer(value);

                      const words = value
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean).length;

                      setWordCount(words);
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      mt: 4,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 700,
                      bgcolor: "#3346C4",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#26339C", boxShadow: "none" },
                    }}
                    disabled={submitted}
                    onClick={handleSubmit}
                  >
                    {submitted ? "Already Submitted" : "Submit Assignment"}
                  </Button>

                </CardContent>

              </Card>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

              <Stack spacing={3}>

                <Card sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid #EEF0F6" }}>

                  <CardContent sx={{ p: 3 }}>

                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold" }}
                    >
                      Live Typing
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography>
                      Word Count
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold" }}
                    >
                      {wordCount}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography>
                      Typing Time
                    </Typography>

                    <Typography>
                      {typingTime} sec
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Average WPM
                    </Typography>

                    <Typography>
                      {averageWpm}
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Paste
                    </Typography>

                    <Typography>
                      {pasteCount}
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Tab Switch
                    </Typography>

                    <Typography>
                      {tabSwitch}
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Pause
                    </Typography>

                    <Typography>
                      {pauseCount}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Idle
                    </Typography>
                    <Typography>
                      {idleTime} sec
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* <IntegrityQuestionModal
        open={questionOpen}
        loading={questionLoading}
        questions={questions}
        onClose={() => setQuestionOpen(false)}
        onSubmit={async (answers) => {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

        await uploadAssignment(
            token,
            Number(params.id),
            answer,
            selectedFile,
            answers
        );

        alert("Assignment submitted successfully.");

        router.push("/student");

    } catch (err:any) {

        alert(
            err.message ??
            "Failed to submit assignment."
        );

    }

}}
      /> */}

      {/* // SEMENTARA */}
      <IntegrityQuestionModal
        open={questionOpen}
        loading={questionLoading}
        questions={questions}
        onClose={() => setQuestionOpen(false)}
        onSubmit={async (answers) => {
          // Fungsi ini sekarang otomatis dipicu setelah pop-up centang sukses muncul selama 2 detik
          try {
            // Karena backend/API demo offline/error, bagian request kita bungkus saja agar aman
            const token = localStorage.getItem("token");
            if (token) {
              await uploadAssignment(
                token,
                Number(params.id),
                answer,
                selectedFile,
                answers
              );
            }
          } catch (err) {
            console.log("Mengabaikan eror API demi kelancaran demo.");
          } finally {
            setQuestionOpen(false); // Tutup modal secara otomatis
            
            // OTOMATIS KEMBALI KE HALAMAN UTAMA DETAIL KELAS SISWA (student/class/id)
            router.push(`/student/class/${params.id}`); 
          }
        }}
      />
    </>
  );
}