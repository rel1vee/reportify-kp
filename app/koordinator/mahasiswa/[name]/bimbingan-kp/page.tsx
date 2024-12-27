"use client";

import Loading from "@/components/Loading";
import WithAuth from "@/components/WithAuth";
import { User, FileText } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import BimbinganModal from "@/components/mahasiswa/BimbinganModal";
import { IBimbingan } from "@/models/Bimbingan";
import { IMahasiswa } from "@/models/Mahasiswa";

interface MahasiswaWithPopulatedBimbingan
  extends Omit<IMahasiswa, "bimbingan"> {
  bimbingan: IBimbingan[];
}

const BimbinganKPPage = ({ params }: { params: Promise<{ name: string }> }) => {
  const { name } = use(params);
  const [student, setStudent] =
    useState<MahasiswaWithPopulatedBimbingan | null>(null);
  const [isBimbinganModalOpen, setIsBimbinganModalOpen] = useState(false);
  const [selectedBimbingan, setSelectedBimbingan] = useState<IBimbingan | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const getInitials = (nama?: string) => {
    if (!nama) {
      return "?";
    }
    const words = nama.trim().split(" ");
    return words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`/api/mahasiswa?email=${name}`);
        if (!response.ok) throw new Error("Failed to fetch student data");
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [name]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading || !student) return <Loading />;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 pt-20 lg:pt-8">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-100 to-blue-100 p-4">
          <h1 className="text-center text-sm sm:text-base lg:text-lg font-bold text-gray-800">
            {student.judulKP}
          </h1>
        </div>

        <div className="bg-white rounded-xl p-6 lg:mt-4 lg:mx-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative lg:mr-4">
              <div className="w-40 h-40 sm:w-50 sm:h-50 rounded-full border-4 border-[#A2E2E8] bg-[#9FD8E4] flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  {getInitials(student.nama)}
                </span>
              </div>
            </div>

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
                    <p className="text-sm text-gray-500">Dosen Pembimbing</p>
                    <p className="font-semibold text-gray-800">
                      {student.dosenPembimbing}
                    </p>
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
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white-50">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
            Riwayat Bimbingan
          </h2>
          <div className="bg-[#D9F9FF] rounded-xl shadow-md overflow-hidden h-auto overflow-y-auto">
            <table className="w-full">
              <thead className="bg-[#F0F9FF]">
                <tr>
                  <th className="w-3/4 py-3 px-4 text-left font-semibold">
                    Tanggal
                  </th>
                  <th className="w-1/12 py-3 px-4 text-center font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {student.bimbingan.map((bimbingan, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-700">
                      {formatDate(bimbingan.tanggal.toString())}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="text-teal-600 hover:text-teal-800 font-medium px-3 py-1 rounded-full bg-teal-50 transition-colors"
                        onClick={() => {
                          setSelectedBimbingan(bimbingan);
                          setIsBimbinganModalOpen(true);
                        }}
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isBimbinganModalOpen && selectedBimbingan && (
        <BimbinganModal
          isOpen={isBimbinganModalOpen}
          onClose={() => {
            setIsBimbinganModalOpen(false);
            setSelectedBimbingan(null);
          }}
          data={selectedBimbingan}
          mahasiswa={student}
        />
      )}
    </div>
  );
};

export default WithAuth(BimbinganKPPage, ["koordinator"]);
