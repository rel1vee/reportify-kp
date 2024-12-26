"use client";

import { Printer } from "lucide-react";
import Loading from "@/components/Loading";
import WithAuth from "@/components/WithAuth";
import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";
import ReviewModal from "@/components/mahasiswa/ReviewModal";
import CetakLaporan from "@/components/mahasiswa/CetakLaporan";

interface IEvaluasiDailyReport {
  dailyReportId?: string;
  pembimbingInstansiId: string;
  komentar: string;
  status: string;
}

interface IAgenda {
  waktuMulai: string;
  waktuSelesai: string;
  judulAgenda: string;
  deskripsiAgenda: string;
  files: string[];
}

interface IDailyReport {
  _id: string;
  tanggal: Date | string;
  agenda?: IAgenda[];
}

interface IMahasiswa {
  _id: string;
  email: string;
  nim: string;
  nama: string;
  judulKP: string;
  instansi: string;
  pembimbingInstansi: string;
  dosenPembimbing: string;
  mulaiKP: string;
  selesaiKP: string;
  reports: IDailyReport[];
}

interface ITask {
  task: string;
  date: string;
  status: string;
}


const DailyReportPage = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const [mahasiswaData, setMahasiswaData] = useState<IMahasiswa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluasiData, setEvaluasiData] = useState<IEvaluasiDailyReport[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: `Daily Report KP - ${mahasiswaData?.nama || ""}`,
    contentRef: printRef as React.RefObject<HTMLElement>,
    pageStyle: `
        @page { 
          size: A4; 
          margin: 1,5cm; 
        }
        body {
          font-family: 'Times New Roman', Times, serif;
        }
      `,
  });

  const convertToTasks = (
    dailyReports: IDailyReport[],
    evaluasiData: IEvaluasiDailyReport[]
  ): ITask[] => {
    return dailyReports.map((report) => {
      const matchingEvaluasi = evaluasiData.find(
        (evaluasi) =>
          evaluasi.dailyReportId?.toString() === report._id?.toString()
      );

      const firstAgenda =
        report.agenda && report.agenda.length > 0 ? report.agenda[0] : null;

      const status = matchingEvaluasi?.status?.trim() || "Belum";

      const normalizedStatus =
        !status || status === "" || status.toLowerCase() === "belum"
          ? "Belum"
          : status;

      return {
        task: firstAgenda
          ? firstAgenda.judulAgenda
          : "Agenda belum ditambahkan.",
        date: formatDate(report.tanggal.toString()),
        status: normalizedStatus,
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mahasiswaResponse = await fetch(
          `/api/mahasiswa?email=${encodeURIComponent(userEmail)}`
        );

        if (!mahasiswaResponse.ok) {
          throw new Error("Failed to fetch report data.");
        }

        const mahasiswaData: IMahasiswa = await mahasiswaResponse.json();
        setMahasiswaData(mahasiswaData);

        const evaluasiResponse = await fetch(
          `/api/evaluasi?email=${encodeURIComponent(userEmail)}`
        );

        if (!evaluasiResponse.ok) {
          throw new Error("Failed to fetch evaluasi data.");
        }

        const evaluasi = await evaluasiResponse.json();
        setEvaluasiData(evaluasi);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      fetchData();
    }
  }, [userEmail]);

  const handleRowClick = (taskIndex: number) => {
    setSelectedTaskIndex(taskIndex);
    setTimeout(() => {
      setIsReviewModalOpen(true);
    }, 0);
  };

  const handleCloseModal = () => {
    setIsReviewModalOpen(false);
    setSelectedTaskIndex(null);
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

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setCurrentDate(today.toLocaleDateString("id-ID", options));
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!mahasiswaData) {
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="text-xl text-gray-600">
          Anda Belum Membuat Laporan...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="text-xl text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  const tasks = mahasiswaData ? convertToTasks(mahasiswaData.reports, evaluasiData): [];

  return (
    <div className="flex-1 h-screen overflow-y-auto w-full bg-white">
      <div style={{ display: "none" }}>
        <CetakLaporan
          ref={printRef}
          mahasiswaData={mahasiswaData}
          evaluasiData={evaluasiData}
        />
      </div>
      <div className="px-7 lg:px-8 pt-16 lg:pt-0">
        <div className="my-8">
          <h1 className="text-xl sm:text-2xl font-bold">Daily Report</h1>
          <p className="text-[#C5C5C5]">{currentDate}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => handlePrint?.()}
            className="bg-[#2C707B] hover:bg-[#225158] text-white py-2 px-4 rounded-xl flex justify-center items-center gap-2 mb-4 text-sm lg:text-base"
          >
            <Printer size={18} />
            Cetak Daily Report
          </button>
        </div>
        {/* Rest of the existing rendering code */}
        <div
          className={`${
            tasks.length > 5 ? "h-[555px] overflow-y-auto" : "h-auto"
          } bg-[#D9F9FF] p-4 rounded-[20px] mb-8`}
        >
          <div className="bg-[#D9F9FF] rounded-xl overflow-hidden">
            <table className="w-full text-left table-fixed">
              <thead>
                <tr className="bg-[#D9F9FF]">
                  <th className="w-1/4 py-4 px-4 sm:px-6 border-b-2 border-gray-600 font-semibold text-xs sm:text-sm tracking-wider">
                    Tanggal
                  </th>
                  <th className="w-1/2 py-4 px-4 sm:px-6 border-b-2 border-gray-600 font-semibold text-xs sm:text-sm tracking-wider">
                    Agenda
                  </th>
                  <th className="w-1/4 py-4 px-4 sm:px-12 border-b-2 border-gray-600 font-semibold text-xs sm:text-sm tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map((task, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(index)}
                    className="hover:bg-[#A1D1DD] transition-colors duration-150 cursor-pointer"
                  >
                    <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-600">
                      {task.date}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-600">
                      {task.task}
                    </td>
                    <td className="py-4 px-4 sm:px-12">
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
      {/* Review Modal */}
      {selectedTaskIndex !== null &&
        mahasiswaData &&
        mahasiswaData.reports[selectedTaskIndex] && (
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={handleCloseModal}
            dailyReport={mahasiswaData.reports[selectedTaskIndex]}
            studentInfo={mahasiswaData}
          />
        )}
    </div>
  );
};

export default WithAuth(DailyReportPage, ["mahasiswa"]);
