"use client";

import { useState, useEffect } from "react";

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
  status?: string;  // Add this to match parent component
  komentar?: string;  // Add this to match parent component
}

interface IEvaluasiDailyReport {
  dailyReportId?: string;
  status?: string;
  komentar?: string;
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
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyReport: IDailyReport | null;
  studentInfo: IMahasiswa;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Sub-components
const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <button
    onClick={onClose}
    className="absolute top-5 lg:top-10 right-4 text-gray-600 hover:text-gray-800"
  >
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

const StudentInfo = ({ studentInfo }: { studentInfo: IMahasiswa }) => (
  <div>
    <InfoField label="NAMA MAHASISWA" value={studentInfo.nama} />
    <InfoField label="NIM" value={studentInfo.nim} />
    <InfoField label="DOSEN PEMBIMBING" value={studentInfo.dosenPembimbing} />
    <InfoField label="PEMBIMBING INSTANSI" value={studentInfo.pembimbingInstansi} />
  </div>
);

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-4 sm:mb-6">
    <h3 className="text-xs sm:text-sm text-gray-500 mb-1">{label}</h3>
    <p className="font-medium text-sm">{value}</p>
  </div>
);

const StatusIndicator = ({ status }: { status: string }) => (
  <div className="mb-4 sm:mb-6">
    <h3 className="text-xs sm:text-sm text-gray-500 mb-1">STATUS</h3>
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${status === "Diterima" ? "bg-green-500" : "bg-red-500"}`} />
      <p className="font-medium text-sm">{status}</p>
    </div>
  </div>
);

const Documentation = ({ agenda }: { agenda?: IAgenda[] }) => (
  <div>
    <h3 className="text-xs sm:text-sm text-gray-500 mb-1">DOKUMENTASI</h3>
    <div className="grid grid-cols-2 gap-4">
      {agenda?.map((ag, agendaIndex) =>
        ag.files?.map((fileUrl, fileIndex) => (
          <img
            key={`dokumentasi-${agendaIndex}-${fileIndex}`}
            src={fileUrl}
            alt={`Dokumentasi ${agendaIndex + 1}-${fileIndex + 1}`}
            className="size-full object-cover rounded-xl"
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = "/placeholder-image.png";
            }}
          />
        ))
      )}
    </div>
  </div>
);

const AgendaList = ({ dailyReport }: { dailyReport: IDailyReport }) => (
  <div className="bg-[#D9F9FF] p-4 sm:p-6 rounded-xl h-auto">
    {dailyReport.agenda?.map((ag, index) => (
      <div key={index} className="mb-4 mt-4">
        {index === 0 && (
          <p className="font-semibold mb-2 text-sm">
            {formatDate(dailyReport.tanggal.toString())}
          </p>
        )}
        <p className="font-semibold mb-2 text-sm">{ag.judulAgenda}</p>
        <p className="font-semibold mb-2 text-sm">
          {ag.waktuMulai} - {ag.waktuSelesai}
        </p>
        <p className="text-xs sm:text-sm mb-2">{ag.deskripsiAgenda}</p>
      </div>
    ))}
  </div>
);

const EvaluasiSection = ({ evaluasi }: { evaluasi: IEvaluasiDailyReport | null }) => (
  <div>
    <div className="flex justify-between items-start">
      <h3 className="text-xs sm:text-sm text-gray-500 mb-1">Evaluasi Agenda</h3>
    </div>
    <div className="bg-white border-4 border-[#9FD8E4] p-4 rounded-xl">
      <p className="text-gray-700 text-xs sm:text-sm">
        {evaluasi?.komentar ? (
          evaluasi.komentar
        ) : (
          <span className="text-gray-500">Belum ada Evaluasi.</span>
        )}
      </p>
    </div>
  </div>
);

// Main Component
const ReviewModal = ({
  isOpen,
  onClose,
  dailyReport,
  studentInfo,
}: ReviewModalProps) => {
  const [evaluasi, setEvaluasi] = useState<IEvaluasiDailyReport | null>(null);
  const [evaluasiStatus, setEvaluasiStatus] = useState<string>("Belum dievaluasi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Updated useEffect to handle pre-fetched evaluasi data
  useEffect(() => {
    if (isOpen && dailyReport) {
      // Use the evaluasi data that's already attached to the dailyReport
      const evaluasiData = {
        dailyReportId: dailyReport._id,
        status: dailyReport.status || "Belum dievaluasi",
        komentar: dailyReport.komentar || ""
      };

      setEvaluasi(evaluasiData);
      setEvaluasiStatus(evaluasiData.status);
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, dailyReport]);

  if (!isOpen || !dailyReport) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl relative shadow-lg max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <CloseButton onClose={onClose} />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-0">
              Review Daily Report
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isSubmitting ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C707B]" />
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {/* Student Info and Status */}
              <div className="grid gap-4 sm:grid-cols-2">
                <StudentInfo studentInfo={studentInfo} />
                <div>
                  {/* Show status only when evaluasi is loaded */}
                  <StatusIndicator status={evaluasiStatus} />
                  <Documentation agenda={dailyReport.agenda} />
                </div>
              </div>

              {/* Agenda Description */}
              <div className="flex justify-between items-start -mb-4">
                <h2 className="text-xs sm:text-sm text-gray-500">DESKRIPSI AGENDA</h2>
              </div>
              <AgendaList dailyReport={dailyReport} />

              {/* Evaluasi Section */}
              <EvaluasiSection evaluasi={evaluasi} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;