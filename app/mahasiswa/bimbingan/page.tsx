"use client";

import { Eye } from "lucide-react";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import WithAuth from "@/components/WithAuth";
import { IBimbingan } from "@/models/Bimbingan";
import { IMahasiswa } from "@/models/Mahasiswa";
import BimbinganModal from "@/components/mahasiswa/BimbinganModal";

interface MahasiswaWithPopulatedBimbingan
  extends Omit<IMahasiswa, "bimbingan"> {
  bimbingan: IBimbingan[];
}

const RiwayatBimbinganPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isBimbinganModalOpen, setIsBimbinganModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<{
    bimbingan: IBimbingan;
    mahasiswa: IMahasiswa;
  } | null>(null);

  const [mahasiswaData, setMahasiswaData] =
    useState<MahasiswaWithPopulatedBimbingan | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      fetchMahasiswaData(email);
    }
  }, []);

  const fetchMahasiswaData = async (email: string) => {
    try {
      const response = await fetch(
        `/api/mahasiswa?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bimbingan data.");
      }

      const data: MahasiswaWithPopulatedBimbingan = await response.json();
      setMahasiswaData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
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

  const handleOpenBimbinganModal = (bimbingan: IBimbingan) => {
    if (mahasiswaData) {
      setSelectedData({
        bimbingan,
        mahasiswa: mahasiswaData,
      });
      setIsBimbinganModalOpen(true);
    }
  };

  const handleCloseBimbinganModal = () => {
    setIsBimbinganModalOpen(false);
    setSelectedData(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!mahasiswaData) {
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="text-xl font-bold text-gray-600">
          Update profile kamu terlebih dahulu...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="text-xl font-bold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto w-full bg-white">
      <div className="px-7 lg:px-8 pt-16 lg:pt-0">
        <div className="my-8">
          <h1 className="text-xl sm:text-2xl font-bold">Bimbingan Kerja Praktik</h1>
          <p className="text-[#C5C5C5]">{currentDate}</p>
        </div>
        {/* Unified layout for all screen sizes */}
        <div className="bg-[#D9F9FF] rounded-[20px] p-4 mb-8">
          <table className="w-full min-w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="py-4 px-4 border-b-2 border-gray-600 font-semibold text-base lg:text-lg whitespace-nowrap">
                  Tanggal
                </th>
                <th className="py-4 px-8 border-b-2 border-gray-600 font-semibold text-base lg:text-lg text-right whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {mahasiswaData.bimbingan?.map(
                (bimbingan: IBimbingan, index: number) => (
                  <tr
                    key={index}
                    className="border-t-2 border-sky-100 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm lg:text-base text-gray-600">
                      {formatDate(bimbingan.tanggal.toString())}
                    </td>
                    <td className="py-3 px-2 text-sm lg:text-base text-right">
                      <button
                        className="py-1 px-3 text-white rounded-xl inline-flex items-center justify-center gap-2 bg-[#2C707B] hover:bg-[#225158] font-medium focus:outline-none transition-colors"
                        onClick={() => handleOpenBimbinganModal(bimbingan)}
                      >
                        <Eye size={18} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isBimbinganModalOpen && selectedData && (
        <BimbinganModal
          isOpen={isBimbinganModalOpen}
          onClose={handleCloseBimbinganModal}
          data={selectedData.bimbingan}
          mahasiswa={selectedData.mahasiswa}
        />
      )}
    </div>
  );
};

export default WithAuth(RiwayatBimbinganPage, ["mahasiswa"]);
