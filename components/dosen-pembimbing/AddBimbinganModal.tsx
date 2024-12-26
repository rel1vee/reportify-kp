"use client";

import { useState } from "react";
import NotificationPopup from "@/components/NotificationPopUp";

interface AddBimbinganModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBimbinganModal = ({ isOpen, onClose }: AddBimbinganModalProps) => {
  const [komentar, setKomentar] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      nip: localStorage.getItem("nip") || "196401196401",
      tanggal: new Date(tanggal),
      komentar: komentar,
      status: "Diterima",
    };

    try {
      const response = await fetch("/api/bimbingan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan bimbingan.");
      }

      setNotification({
        message: "Bimbingan berhasil disimpan!",
        type: "success",
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        message: "Terjadi kesalahan pada server.",
        type: "error",
      });
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
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-lg sm:max-w-[500px] w-[90%] p-6 space-y-6">
          <h2 className="text-xl font-semibold">Beri Evaluasi Bimbingan KP</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm text-gray-600">
                Hari/Tanggal Bimbingan
              </label>
              <input
                id="date"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="evaluation"
                className="block text-sm text-gray-600"
              >
                Evaluasi Bimbingan KP
              </label>
              <textarea
                id="evaluation"
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Masukkan evaluasi bimbingan..."
              />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                onClick={onClose}
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-[#00796B] rounded-md hover:bg-[#00695C] transition-colors disabled:bg-opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddBimbinganModal;
