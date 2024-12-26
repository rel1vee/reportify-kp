"use client";

import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import WithAuth from "@/components/WithAuth";
import { IDailyReport } from "@/models/DailyReport";
import { useEffect, useState, useMemo } from "react";

interface Student {
  _id: string;
  nama: string;
  nim: string;
  instansi: string;
  reports: IDailyReport[];
}

const DaftarMahasiswaKPPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const pembimbingInstansi = localStorage.getItem("nama");

        if (!pembimbingInstansi) return;

        const response = await fetch(
          `/api/mahasiswa?pembimbingInstansi=${encodeURIComponent(
            pembimbingInstansi
          )}`
        );
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        student.nama.toLowerCase().includes(searchTerm) ||
        student.nim.includes(searchTerm)
      );
    });
  }, [searchQuery, students]);

  const handleCardClick = (id: string) => {
    router.push(`/pembimbing-instansi/mahasiswa/${id}`);
  };

  const getInitials = (nama?: string) => {
    if (!nama) {
      return "?";
    }
    const words = nama.trim().split(" ");
    return words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full overflow-y-auto min-h-screen px-7 lg:px-8 pt-24 lg:pt-8 pb-8">
      <div className="flex items-center justify-between mb-8 relative">
        <h2 className="text-base lg:text-xl font-bold text-center">
          Daftar Mahasiswa Kerja Praktik
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama mahasiswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 pl-10 text-gray-800 bg-white border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Search icon */}
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
              fill="#323232"
            />
          </svg>
        </div>
      </div>

      <div className="h-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                key={student._id}
                onClick={() => handleCardClick(student._id)}
                className="flex items-center justify-center bg-[#D9F9FF] p-6 rounded-[20px] shadow-md hover:shadow-lg  relative cursor-pointer hover:bg-[#C5F2FF] transition-colors flex-grow"
              >
                <div className="flex items-center justify-center w-[75px] h-[75px] bg-[#9FD8E4] rounded-full text-white text-2xl font-semibold mr-4">
                  {getInitials(student.nama)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{student.nama}</h3>
                  <p className="text-gray-600">{student.nim}</p>
                </div>
                {student.reports?.length > 0 && (
                  <div className="absolute top-2 right-2 bg-[#2C707B] text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {student.reports.length}+
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-600">
              Tidak ada mahasiswa yang ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithAuth(DaftarMahasiswaKPPage, ["pembimbing-instansi"]);
