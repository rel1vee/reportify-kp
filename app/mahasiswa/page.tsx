"use client";

import { HelpCircle } from "lucide-react";
import Loading from "@/components/Loading";
import WithAuth from "@/components/WithAuth";
import React, { useEffect, useState } from "react";
import FAQModal from "@/components/mahasiswa/FAQsModal";

const DashboardMahasiswaPage = () => {
  const [totalDays, setTotalDays] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const nama = localStorage.getItem("nama") || "";

  const faqs = [
    {
      question: "Cara mengisi Daily Report",
      answer:
        "Halaman dashboard, pilih Tambah Laporan. Isi detail agenda seperti waktu, dokumentasi, deskripsi singkat, dan hasil yang dicapai. Pastikan deskripsi informatif tetapi singkat. Setelah selesai, klik Simpan untuk menyimpan.",
    },
    {
      question: "Kapan harus mengumpulkan Daily Report?",
      answer:
        "Daily Report harus dikumpulkan setiap hari kerja sebelum pukul 17:00 WIB.",
    },
    {
      question: "Bagaimana jika saya lupa mengisi Daily Report?",
      answer:
        "Jika Anda lupa mengisi Daily Report, segera hubungi pembimbing Anda dan isi laporan yang terlewat dengan mencantumkan alasan keterlambatan.",
    },
    {
      question: "Apa yang harus dilaporkan dalam Daily Report?",
      answer:
        "Daily Report harus mencakup: Aktivitas yang dilakukan, Progress pekerjaan, Kendala yang dihadapi, Solusi yang diterapkan, dan Rencana untuk hari berikutnya.",
    },
  ];

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setCurrentDate(today.toLocaleDateString("id-ID", options));

    const email = localStorage.getItem("email");

    if (email) {
      fetch(`/api/mahasiswa?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.mulaiKP && data.selesaiKP) {
            const mulaiKP = new Date(data.mulaiKP);
            const selesaiKP = new Date(data.selesaiKP);
            const totalHariKP = Math.ceil(
              (selesaiKP.getTime() - mulaiKP.getTime()) / (1000 * 60 * 60 * 24)
            );

            const hariBerjalan =
              today >= mulaiKP
                ? Math.min(
                    Math.ceil(
                      (today.getTime() - mulaiKP.getTime()) /
                        (1000 * 60 * 60 * 24)
                    ),
                    totalHariKP
                  )
                : 0;

            setTotalDays(totalHariKP);
            setCurrentDay(hariBerjalan);
            setProgressPercentage((hariBerjalan / totalHariKP) * 100);
          }
        })
        .catch((err) => console.error("Error fetching data:", err))
        .finally(() => setIsLoading(false));
    }
  }, []);

  const timelinePoints = Array.from({ length: 6 }, (_, index) => {
    const day = index * Math.ceil(totalDays / 6);
    return {
      day: day === 0 ? 0 : day,
      isActive: currentDay >= day,
    };
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 overflow-y-auto justify-center w-full h-screen">
      <div className="px-7 lg:px-8 pt-16 lg:pt-0">
        <div className="my-8">
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <p className="text-[#C5C5C5]">{currentDate}</p>
        </div>
        <div className="bg-[#D9F9FF] w-full p-4 sm:p-6 rounded-[20px] mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold">
            Hi, <strong>{nama}!</strong>
          </h2>
          <p className="text-[#C5C5C5] mt-2 text-sm sm:text-base">
            Awali hari ini dengan semangat dan dedikasi! Setiap langkah kecil
            yang Anda ambil dalam mengisi <i>Daily Report</i> membawa Anda lebih
            dekat menuju kesuksesan. Terus belajar dan berkembang!
          </p>
        </div>
        {/* Info Boxes */}
        <div className="grid grid-cols-2 gap-4 mb-4 sm:mb-8">
          {/* Work Day Box */}
          <div className="bg-[#D9F9FF] p-4 sm:p-6 rounded-[20px] shadow">
            <h3 className="text-base sm:text-lg font-semibold">
              Hari Kerja Praktik
            </h3>
            <p className="text-[#C5C5C5] mt-1 text-sm sm:text-base">
              Ayo, Semangat!
            </p>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-[#7CE9FF] via-[#397480] to-[#0B191C] bg-clip-text text-transparent mt-1">
              Ke-{currentDay}
            </p>
          </div>
          {/* FAQ Box */}
          <div
            className="bg-[#D9F9FF] p-4 sm:p-6 rounded-[20px] shadow cursor-pointer hover:bg-[#C5EEFF] transition-colors"
            onClick={() => setIsFAQModalOpen(true)}
          >
            <h3 className="text-base sm:text-lg font-semibold flex justify-between items-center">
              FAQs
              <HelpCircle size={22} />
            </h3>
            <p className="text-[#C5C5C5] mt-1 text-sm sm:text-base">
              Apakah Anda butuh bantuan?
            </p>
          </div>
        </div>
        {/* Progress Section */}
        <div className="bg-[#D9F9FF] p-4 sm:p-6 rounded-[20px] shadow mb-10">
          <div className="flex sm:flex-row justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              Progress Kerja Praktik
            </h3>
            <div className="text-xs sm:text-sm text-gray-950">
              {currentDay} dari {totalDays} hari
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="w-full bg-white rounded-full h-2 sm:h-3">
              <div
                className="bg-[#FFBF5F] h-2 sm:h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          {/* Timeline */}
          <div className="relative overflow-x-auto pb-4">
            <div className="absolute h-1 bg-white left-0 right-0 top-3 sm:top-4" />
            <div className="relative flex justify-between min-w-[300px] sm:min-w-[500px] px-2 sm:px-4">
              {timelinePoints.map(({ day, isActive }, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-base ${
                      isActive
                        ? "bg-[#FFBF5F] text-white shadow-md"
                        : "bg-white text-gray-300"
                    }`}
                  >
                    {day}
                  </div>
                  <div
                    className={`mt-2 text-xs sm:text-sm ${
                      isActive ? "text-gray-950" : "text-gray-300"
                    }`}
                  >
                    Hari ke-{day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FAQModal
        isOpen={isFAQModalOpen}
        onClose={() => setIsFAQModalOpen(false)}
        faqs={faqs}
      />
    </div>
  );
};

export default WithAuth(DashboardMahasiswaPage, ["mahasiswa"]);
