"use client";

import { useRouter } from "next/navigation";
import WithAuth from "@/components/WithAuth";
import { useEffect, useState, useMemo } from "react";
import Loading from "@/components/Loading";

interface Student {
  _id: string;
  nama: string;
  nim: string;
  email: string;
  judulKP: string;
  instansi: string;
  pembimbingInstansi: string;
  dosenPembimbing: string;
  mulaiKP: string;
  selesaiKP: string;
  reports: Report[];
  bimbingan: Bimbingan[];
}

interface Report {
  _id: string;
  tanggal: string;
  agenda: Agenda[];
}

interface Agenda {
  waktuMulai: string;
  waktuSelesai: string;
  judulAgenda: string;
  deskripsiAgenda: string;
  files: string[];
}

interface Bimbingan {
  _id: string;
  tanggal: string;
  status: string;
  komentar: string;
}

const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-[#2C707B] h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center h-screen">
//     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C707B]" />
//   </div>
// );

const DaftarMahasiswaPage = () => {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/mahasiswa");
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        student.nama.toLowerCase().includes(searchTerm) ||
        student.instansi.toLowerCase().includes(searchTerm) ||
        student.nim.includes(searchTerm)
      );
    });
  }, [searchQuery, students]);

  const handleCardClick = (id: string) => {
    router.push(`/koordinator/mahasiswa/${id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getInitials = (nama?: string) => {
    if (!nama) {
      return "?";
    }
    const words = nama.trim().split(" ");
    return words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
  };

  const calculateProgress = (student: Student): number => {
    const startDate = new Date(student.mulaiKP);
    const endDate = new Date(student.selesaiKP);
    const today = new Date();

    if (today < startDate) return 0;
    if (today > endDate) return 100;

    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysPassed = Math.ceil(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Math.round((daysPassed / totalDays) * 100);
  };

  const getPendingBimbinganCount = (student: Student): number => {
    return student.bimbingan.filter((b) => b.status === "pending").length;
  };

  const getSemester = (nim: string): number => {
    const year = parseInt(nim.substring(1, 3));
    const currentYear = new Date().getFullYear() % 100;
    const semester = (currentYear - year) * 2 + 1;
    return semester > 0 ? semester : 1;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return <Loading />;

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
      <div className="flex items-center justify-between my-6">
        <h2 className="text-xl font-bold">Mahasiswa KP Teknik Informatika</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari mahasiswa, NIM, atau Instansi..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-96 px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full 
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      <div className="overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => {
              const progress = calculateProgress(student);
              const pendingCount = getPendingBimbinganCount(student);
              return (
                <div
                  key={student._id}
                  onClick={() => handleCardClick(student.email)}
                  className="bg-[#D9F9FF] p-6 rounded-[20px] shadow hover:shadow-md transition-all duration-300 
                           cursor-pointer relative group border border-transparent"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div
                        className="flex items-center justify-center w-16 h-16 bg-[#9FD8E4] rounded-full 
                                    text-white text-xl font-semibold shadow-sm"
                      >
                        {getInitials(student.nama)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-lg font-bold truncate text-gray-800">
                          {student.nama}
                        </h3>
                        {pendingCount > 0 && (
                          <span
                            className="inline-flex items-center justify-center bg-red-500 text-white 
                                         text-xs font-semibold px-2 py-1 rounded-full min-w-[20px]"
                          >
                            {pendingCount}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 mb-3">
                        <p className="text-gray-600 text-sm">
                          {student.nim} • Semester {getSemester(student.nim)}
                        </p>
                        <p className="text-gray-700 text-sm font-medium">
                          {student.instansi}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-end text-sm">
                          <span className="text-gray-800 font-medium">
                            {progress}%
                          </span>
                        </div>
                        <ProgressBar value={progress} />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{formatDate(student.mulaiKP)}</span>
                          <span>{formatDate(student.selesaiKP)}</span>
                        </div>
                      </div>
                      {/* <div className="mt-3 text-sm text-gray-600">
                        <p className="truncate">
                          Pembimbing: {student.dosenPembimbing}
                        </p>
                      </div> */}
                    </div>
                  </div>
                  <div
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity 
                                duration-300 text-sm text-[#2C707B] font-medium"
                  >
                    Lihat Detail →
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              Tidak ada mahasiswa yang ditemukan...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithAuth(DaftarMahasiswaPage, ["koordinator"]);
