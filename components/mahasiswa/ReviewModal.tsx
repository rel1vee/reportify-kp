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

const ReviewModal = ({
  isOpen,
  onClose,
  dailyReport,
  studentInfo,
}: ReviewModalProps) => {
  const [evaluasi, setEvaluasi] = useState<IEvaluasiDailyReport | null>(null);
  const [evaluasiStatus, setEvaluasiStatus] = useState<string>("Belum");
  const [isEditing, setIsEditing] = useState(false);
  const [editedAgenda, setEditedAgenda] = useState<IAgenda[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && dailyReport) {
      setEditedAgenda(dailyReport.agenda || []);
      setIsEditing(false);
      setError(null);
      fetchEvaluasi();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dailyReport]);

  const startEditing = () => {
    if (evaluasiStatus !== "Belum") {
      return;
    }
    setIsEditing(true);
    setEditedAgenda(JSON.parse(JSON.stringify(dailyReport?.agenda || [])));
  };

  const handleInputChange = (
    index: number,
    field: keyof IAgenda,
    value: string
  ) => {
    setEditedAgenda((prevAgenda) => {
      const newAgenda = [...prevAgenda];
      newAgenda[index] = {
        ...newAgenda[index],
        [field]: value,
      };
      return newAgenda;
    });
  };

  const validateAgenda = (agenda: IAgenda[]): boolean => {
    return agenda.every(
      (item) =>
        item.waktuMulai &&
        item.waktuSelesai &&
        item.judulAgenda &&
        item.deskripsiAgenda
    );
  };

  const handleSave = async () => {
    if (!dailyReport?._id) {
      setError("Invalid daily report data.");
      return;
    }

    if (!validateAgenda(editedAgenda)) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/daily-report", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: dailyReport._id,
          agenda: editedAgenda,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update agenda.");
      }

      const updatedData = await response.json();
      setIsEditing(false);

      if (dailyReport) {
        dailyReport.agenda = updatedData.agenda;
      }

      await fetchEvaluasi();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while updating."
      );
      console.error("Error updating agenda:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAgenda(dailyReport?.agenda || []);
    setError(null);
  };

  const fetchEvaluasi = async () => {
    if (!dailyReport?._id) return;

    try {
      const response = await fetch(
        `/api/evaluasi?dailyreportId=${dailyReport._id}`
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil evaluasi");
      }

      const data = await response.json();
      setEvaluasi(data);

      const status = data?.status?.trim().toLowerCase();
      setEvaluasiStatus(!status || status === "" ? "Belum" : data.status);
    } catch (error) {
      console.error("Error fetching evaluasi:", error);
      setEvaluasiStatus("Belum");
    }
  };

  // useEffect(() => {
  //   if (isOpen) {
  //     fetchEvaluasi();
  //   }
  // }, [isOpen, dailyReport?._id]);

  if (!isOpen || !dailyReport) return null;

  // const { tanggal, agenda } = dailyReport;
  // const { komentar } = evaluasi || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl relative shadow-lg max-h-[90vh] overflow-auto">
        {/* Header Section - Fixed */}
        <div className="p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <button
            onClick={onClose}
            className="absolute top-5 lg:top-10 right-4 text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-0">
              Review Daily Report
            </h2>
            <div
              className={`${
                evaluasiStatus === "Diterima" ? "bg-[#99CC33]" : "bg-[#FFCC00]"
              } p-4 rounded-xl flex justify-between lg:justify-center items-center text-xs sm:text-sm sm:mr-8 lg:mr-6`}
            >
              <p className="mr-1">
                Deskripsi agenda dapat diganti sebelum di ACC Pembimbing
                Instansi
              </p>
              <div className="w-6 h-6 bg-[#323232] rounded-full flex items-center justify-center text-white ml-2">
                <span className="text-sm sm:text-lg font-bold">!</span>
              </div>
            </div>
          </div>
        </div>
        {/* Scrollable Content */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Error message display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              <p className="text-sm">{error}</p>
            </div>
          )}
          <div className="grid gap-4 sm:gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Left Column */}
              <div>
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm text-gray-500 mb-1">
                    NAMA MAHASISWA
                  </h3>
                  <p className="font-medium text-sm">{studentInfo.nama}</p>
                </div>
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm text-gray-500 mb-1">NIM</h3>
                  <p className="font-medium text-sm">{studentInfo.nim}</p>
                </div>
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm text-gray-500 mb-1">
                    DOSEN PEMBIMBING
                  </h3>
                  <p className="font-medium text-sm">
                    {studentInfo.dosenPembimbing}
                  </p>
                </div>
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm text-gray-500 mb-1">
                    PEMBIMBING INSTANSI
                  </h3>
                  <p className="font-medium text-sm">
                    {studentInfo.pembimbingInstansi}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm text-gray-500 mb-1">
                    STATUS
                  </h3>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        evaluasiStatus === "Diterima"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <p className="font-medium text-sm">{evaluasiStatus}</p>
                  </div>
                </div>

                {/* Dokumentasi Section */}
                <h3 className="text-xs sm:text-sm text-gray-500 mb-1">
                  DOKUMENTASI
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {dailyReport.agenda?.map((ag, agendaIndex) =>
                    ag.files?.map((fileUrl, fileIndex) => (
                      // eslint-disable-next-line @next/next/no-img-element
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
                {/* End Dokumentasi Section */}
              </div>
              <div className="flex justify-between items-start -mb-4">
                <h2 className="text-xs sm:text-sm text-gray-500">
                  DESKRIPSI AGENDA
                </h2>
              </div>
            </div>

            {/* Agenda Description */}
            <div className="bg-[#D9F9FF] p-4 sm:p-6 rounded-xl h-auto ">
              {isSubmitting && (
                <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center rounded-xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C707B]"></div>
                </div>
              )}
              <div className="flex justify-end items-start -mb-6">
                {evaluasiStatus === "Belum" && !isEditing ? (
                  <button
                    className="p"
                    onClick={startEditing}
                    disabled={isSubmitting}
                  >
                    <svg
                      width="20"
                      height="20"
                      className={`sm:w-6 sm:h-6 ${
                        isSubmitting ? "opacity-50" : ""
                      }`}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_195_915)">
                        <path
                          d="M14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z"
                          fill="#323232"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_195_915">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                ) : isEditing ? (
                  <div className="flex gap-2">
                    <button
                      className={`bg-green-500 text-white px-2 py-1 rounded text-sm ${
                        isSubmitting
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-green-600"
                      }`}
                      onClick={handleSave}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                      className={`bg-red-500 text-white px-2 py-1 rounded text-sm ${
                        isSubmitting
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-600"
                      }`}
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Batal
                    </button>
                  </div>
                ) : null}
              </div>

              {dailyReport.agenda?.map((ag, index) => (
                <div key={index} className="mb-4 mt-4">
                  {index === 0 && (
                    <p className="font-semibold mb-2 text-sm">
                      {formatDate(dailyReport.tanggal.toString())}
                    </p>
                  )}
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editedAgenda[index].judulAgenda}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "judulAgenda",
                            e.target.value
                          )
                        }
                        disabled={isSubmitting}
                        className="border rounded-xl px-2 py-1 text-sm w-full mb-2 font-semibold"
                      />
                      <div className="flex gap-2 mb-2">
                        <input
                          type="time"
                          value={editedAgenda[index].waktuMulai}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "waktuMulai",
                              e.target.value
                            )
                          }
                          disabled={isSubmitting}
                          className="border rounded-xl px-2 py-1 text-sm w-32"
                        />
                        <span className="self-center">-</span>
                        <input
                          type="time"
                          value={editedAgenda[index].waktuSelesai}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "waktuSelesai",
                              e.target.value
                            )
                          }
                          disabled={isSubmitting}
                          className="border rounded-xl px-2 py-1 text-sm w-32"
                        />
                      </div>
                      <textarea
                        value={editedAgenda[index].deskripsiAgenda}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "deskripsiAgenda",
                            e.target.value
                          )
                        }
                        className="border rounded-xl px-2 py-1 text-sm w-full mb-2"
                        rows={6}
                        disabled={isSubmitting}
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-semibold mb-2 text-sm">
                        {ag.judulAgenda}
                      </p>
                      <p className="font-semibold mb-2 text-sm">
                        {ag.waktuMulai} - {ag.waktuSelesai}
                      </p>
                      <p className="text-xs sm:text-sm mb-2">
                        {ag.deskripsiAgenda}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Evaluasi Agenda Section */}
            <div className="flex justify-between items-start -mb-4">
              <h3 className="text-xs sm:text-sm text-gray-500">
                Evaluasi Agenda
              </h3>
            </div>
            <div className="bg-white border-4 border-[#9FD8E4] p-4 rounded-xl">
              <p className="text-gray-700 text-xs sm:text-sm mt-2">
                {evaluasi?.komentar ? (
                  evaluasi.komentar
                ) : (
                  <span className="text-gray-500">Belum ada Evaluasi</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
