"use client";

import { useState } from "react";
import NotificationPopup from "@/components/NotificationPopUp";

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

interface EvaluasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyReport: IDailyReport | null;
}

const AddEvaluasiModal = ({
  isOpen,
  onClose,
  dailyReport,
}: EvaluasiModalProps) => {
  const [komentar, setKomentar] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  if (!isOpen || !dailyReport) return null;

  const nip = localStorage.getItem("nip");

  const handleSave = async () => {
    setIsLoading(true);

    const payload = {
      dailyReportId: dailyReport._id,
      nip: nip, 
      komentar: komentar,
      status: isAccepted ? "Diterima" : "Belum",
    };

    try {
      const response = await fetch("/api/evaluasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await response.json();
        setNotification({
          message: "Terjadi kesalahan pada server!",
          type: "error",
        });
      } else {
        setNotification({
          message: "Evaluasi berhasil disimpan!",
          type: "success",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    {/* Popup Notification */}
    {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.37448 4.37406C-0.504558 9.25309 -0.504558 17.1727 4.37448 22.0517C9.25352 26.9308 17.1731 26.9308 22.0521 22.0517C26.9312 17.1727 26.9312 9.25309 22.0521 4.37406C17.1731 -0.504981 9.25352 -0.504981 4.37448 4.37406ZM18.5166 9.67736L14.9811 13.2129L18.5166 16.7484L16.7488 18.5162L13.2133 14.9807L9.67778 18.5162L7.91001 16.7484L11.4455 13.2129L7.91001 9.67736L9.67778 7.90959L13.2133 11.4451L16.7488 7.90959L18.5166 9.67736Z"
              fill="#C5C5C5"
              fillOpacity="0.5"
            />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-center">
          Evaluasi Daily Report
          <br />
          {/* <span className="font-bold">{dailyReport.nama}</span> */}
        </h2>
        <textarea
          className="w-full h-32 mt-4 p-3 border rounded-xl focus:outline-none focus:border-blue-500"
          placeholder="Masukkan evaluasi..."
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
        />
        <div className="mt-4">
          <span>Validasi Laporan</span>
          <label className="flex items-center space-x-2 text-gray-700">
            <input
              type="checkbox"
              name="validation"
              className="form-checkbox h-4 w-4"
              checked={isAccepted}
              onChange={(e) => setIsAccepted(e.target.checked)}
            />
            <span>Terima</span>
          </label>
        </div>
        <button
          className="mt-6 w-full py-2 text-white bg-[#2C707B] hover:bg-[#225158] rounded-[20px] hover:gradient-to-b from-[#52BD3A] to-[#26571B] focus:outline-none"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Menyimpan..." : "SIMPAN"}
        </button>
      </div>
    </div>
    </>
  );
};

export default AddEvaluasiModal;
