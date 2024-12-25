"use client";

import WithAuth from "@/components/WithAuth";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { IDailyReport } from "@/models/DailyReport";

interface Student {
  _id: string;
  nama: string;
  nim: string;
  judulKP: string;
  instansi: string;
  mulaiKP: string;
  selesaiKP: string;
  reports: IDailyReport[];
}

interface GroupedStudents {
  [key: string]: Student[];
}

const DashboardDosenPembimbingPage = () => {
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [animatedProgress, setAnimatedProgress] = useState<{
    [key: string]: number;
  }>({});

  const nama = localStorage.getItem("nama") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dosenPembimbing = encodeURIComponent(nama);
        const response = await fetch(
          `/api/mahasiswa?dosenPembimbing=${dosenPembimbing}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setCurrentDate(today.toLocaleDateString("id-ID", options));

    fetchData();
  }, [nama]);

  useEffect(() => {
    // Animate progress bars when students data is loaded
    if (students.length > 0) {
      const timeouts = students.map((student, index) => {
        const progress = calculateProgress(student.mulaiKP, student.selesaiKP);
        return setTimeout(() => {
          setAnimatedProgress((prev) => ({
            ...prev,
            [student._id]: progress,
          }));
        }, index * 200);
      });

      return () => timeouts.forEach(clearTimeout);
    }
  }, [students]);

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysPassed = Math.ceil(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Math.min(
      Math.max(Math.round((daysPassed / totalDays) * 100), 0),
      100
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (nama?: string) => {
    if (!nama) {
      return "?";
    }
    const words = nama.trim().split(" ");
    return words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
  };

  // Group students by company
  const groupedStudents: GroupedStudents = students.reduce((acc, student) => {
    if (!acc[student.instansi]) {
      acc[student.instansi] = [];
    }
    acc[student.instansi].push(student);
    return acc;
  }, {} as GroupedStudents);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-7 lg:px-8 pt-16 lg:pt-0">
      <div className="my-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">{currentDate}</p>
      </div>

      <div className="bg-[#D9F9FF] p-8 rounded-[20px] mb-10">
        <h2 className="text-lg sm:text-xl font-semibold mb-3">
          Hi, <strong>{nama}</strong> 👋
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Selamat datang kembali di dashboard monitoring KP Anda. Sebagai dosen
          pembimbing, Anda memiliki peran penting dalam membentuk masa depan
          para mahasiswa bimbingan Anda. Mari bersama-sama memastikan setiap
          mahasiswa mencapai potensi terbaiknya dalam program Kerja Praktek ini.
        </p>
        <p className="text-[#2C707B] font-medium mt-3">
          &quot;Membimbing dengan hati, menginspirasi dengan tindakan, dan
          membangun masa depan dengan ilmu.&quot;
        </p>
      </div>

      {/* Company and Student Internship Statistics */}
      <div className="bg-[#D9F9FF] p-6 rounded-2xl shadow-lg mb-10">
        {/* <h2 className="text-xl font-bold mb-6 text-gray-800">
          Progress Mahasiswa Bimbingan KP Anda:
        </h2> */}
        <div className="space-y-6">
          {Object.entries(groupedStudents).map(
            ([instansi, students], companyIdx) => (
              <div
                key={companyIdx}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold mb-4">{instansi}</h3>
                <ul className="space-y-3">
                  {students.map((student) => {
                    const progress = animatedProgress[student._id] || 0;

                    return (
                      <li
                        key={student._id}
                        className="flex items-center justify-between border border-gray-100 bg-white rounded-xl p-4 md:p-8 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-[#9FD8E4] text-white flex items-center justify-center font-semibold">
                            {getInitials(student.nama)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {student.nama}
                            </p>
                            <p className="text-sm text-gray-500">
                              {student.nim}
                            </p>
                          </div>
                        </div>
                        <div className="w-1/2">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-[#FFBF5F] h-3 rounded-full transition-width duration-500 ease-out"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {formatDate(student.mulaiKP)} -{" "}
                              {formatDate(student.selesaiKP)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {progress}% Completed
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default WithAuth(DashboardDosenPembimbingPage, ["dosen-pembimbing"]);
