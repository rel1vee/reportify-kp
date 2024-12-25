"use client";

import Loading from "@/components/Loading";
import WithAuth from "@/components/WithAuth";
import { use, useEffect, useState } from "react";
import { IDailyReport } from "@/models/DailyReport";
import { User, FileText, Calendar } from "lucide-react";
import { IEvaluasiDailyReport } from "@/models/EvaluasiDailyReport";
import ReviewModal from "@/components/pembimbing-instansi/ReviewModal";

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
  reports: IDailyReport[];
}

interface PageProps {
  params: Promise<{ name: string }>;
}

const DailyReportMahasiswaPage = ({ params }: PageProps) => {
  const { name } = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(
    null
  );
  const [evaluasiData, setEvaluasiData] = useState<IEvaluasiDailyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dosenPembimbing = localStorage.getItem("nama");
        if (!dosenPembimbing) throw new Error("Pembimbing not found.");

        // Fetch student data
        const studentResponse = await fetch(
          `/api/mahasiswa?dosenPembimbing=${encodeURIComponent(
            dosenPembimbing
          )}`
        );

        if (!studentResponse.ok)
          throw new Error("Failed to fetch student data.");

        const students = await studentResponse.json();
        const currentStudent = students.find((s: Student) => s._id === name);
        if (!currentStudent) throw new Error("Student not found.");

        setStudent(currentStudent);

        // Fetch evaluasi data
        const evalResponse = await fetch(`/api/evaluasi`);
        if (!evalResponse.ok) throw new Error("Failed to fetch evaluasi data.");
        const evaluations: IEvaluasiDailyReport[] = await evalResponse.json();
        setEvaluasiData(evaluations);

        // Match evaluations to reports
        const matchedReports = currentStudent.reports.map(
          (report: IDailyReport) => {
            const matchedEvaluation = evaluations.find(
              (evalItem) => evalItem.dailyReportId === report._id
            );
            return {
              ...report,
              status: matchedEvaluation?.status || "Belum dievaluasi",
              komentar: matchedEvaluation?.komentar || "",
            };
          }
        );

        setStudent({ ...currentStudent, reports: matchedReports });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const getInitials = (nama?: string) => {
    if (!nama) {
      return "?";
    }
    const words = nama.trim().split(" ");
    return words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
  };

  const handleRowClick = (taskIndex: number) => {
    setSelectedTaskIndex(taskIndex);
    setIsReviewModalOpen(true);
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const date = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !student) {
    return (
      <div className="flex-1 h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  const tasks = student.reports.map((report) => {
    const matchingEvaluasi = evaluasiData.find(
      (evaluasi) =>
        evaluasi.dailyReportId?.toString() === report._id?.toString()
    );
    const firstAgenda = report.agenda?.[0];

    return {
      task: firstAgenda?.judulAgenda || "No Agenda.",
      date: formatDate(report.tanggal.toString()),
      komentar: matchingEvaluasi?.komentar?.trim() || "Belum ada komentar.",
      status: matchingEvaluasi?.status?.trim() || "Belum dievaluasi",
    };
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-14 lg:my-0">
        {/* Title */}
        <div className="bg-gradient-to-r from-cyan-100 to-blue-100 p-4">
          <h1 className="text-center text-sm sm:text-base lg:text-lg font-bold text-gray-800">
            {student.judulKP}
          </h1>
        </div>

        {/* Profile Card */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-40 h-40 sm:w-50 sm:h-50 rounded-full border-4 border-[#A2E2E8] bg-[#9FD8E4] flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  {getInitials(student.nama)}
                </span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="text-cyan-600" />
                  <div>
                    <p className="text-sm text-gray-500">Nama Mahasiswa</p>
                    <p className="font-semibold text-gray-800">
                      {student.nama}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FileText className="text-cyan-600" />
                  <div>
                    <p className="text-sm text-gray-500">NIM</p>
                    <p className="font-semibold text-gray-800">{student.nim}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="text-cyan-600" />
                  <div>
                    <p className="text-sm text-gray-500">Pembimbing Instansi</p>
                    <p className="font-semibold text-gray-800">
                      {student.pembimbingInstansi}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="text-cyan-600" />
                  <div>
                    <p className="text-sm text-gray-500">Dosen Pembimbing</p>
                    <p className="font-semibold text-gray-800">
                      {student.dosenPembimbing}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="text-cyan-600" />
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Mulai KP</p>
                    <p className="font-semibold text-gray-800">
                      {date(student.mulaiKP.toString())}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="text-cyan-600" />
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Selesai KP</p>
                    <p className="font-semibold text-gray-800">
                      {date(student.selesaiKP.toString())}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Report Section */}
        <div className="p-8">
          {/* <h2 className="text-xl font-semibold mb-4">Daily Report:</h2> */}
          <div
            className={`${
              tasks.length > 5 ? "h-[250px] overflow-y-auto" : "h-auto"
            } bg-[#D9F9FF] p-4 rounded-[20px] mb-2`}
          >
            <div className="bg-[#D9F9FF] rounded-xl overflow-hidden">
              <table className="w-full text-left table-fixed">
                <thead>
                  <tr className="bg-[#D9F9FF]">
                    <th className="w-1/4 py-4 px-4 sm:px-6 border-b-2 border-gray-600 font-semibold text-xs sm:text-sm tracking-wider">
                      Date
                    </th>
                    <th className="w-1/2 py-4 px-4 sm:px-6 border-b-2 border-gray-600 font-semibold text-xs sm:text-sm tracking-wider">
                      All Task
                    </th>
                    <th className="w-1/4 py-4 px-4 sm:px-6 border-b-2 border-gray-600 font-semibold text-xs sm:text-sm tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tasks.map((task, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#A1D1DD] transition-colors duration-150 cursor-pointer"
                      onClick={() => handleRowClick(index)}
                    >
                      <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-600">
                        {task.date}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-900">
                        {task.task}
                      </td>
                      <td className="col-span-2 py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-600">
                        
                          <span
                            className={`inline-block px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium ${
                              task.status === "Diterima"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {task.status}
                          </span>
                      
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedTaskIndex !== null && student.reports[selectedTaskIndex] && (
        <>
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            dailyReport={student.reports[selectedTaskIndex]}
            studentInfo={student}
          />
        </>
      )}
    </div>
  );
};

export default WithAuth(DailyReportMahasiswaPage, ["dosen-pembimbing"]);
