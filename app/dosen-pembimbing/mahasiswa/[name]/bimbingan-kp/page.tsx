"use client";

import Loading from "@/components/Loading";
import { User, FileText, Plus } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import BimbinganModal from "@/components/mahasiswa/BimbinganModal";
import AddBimbinganModal from "@/components/dosen-pembimbing/AddBimbinganModal";
import WithAuth from "@/components/WithAuth";
import { IBimbingan } from "@/models/Bimbingan";
import { IMahasiswa } from "@/models/Mahasiswa";

interface MahasiswaWithPopulatedBimbingan
  extends Omit<IMahasiswa, "bimbingan"> {
  bimbingan: IBimbingan[];
}

const BimbinganKPPage = ({ params }: { params: Promise<{ name: string }> }) => {
  const { name } = use(params);
  const [student, setStudent] = useState<MahasiswaWithPopulatedBimbingan | null>(null);
  const [isBimbinganKPModalOpen, setIsBimbinganKPModalOpen] = useState(false);
  const [isBimbinganModalOpen, setIsBimbinganModalOpen] = useState(false);
  const [selectedBimbingan, setSelectedBimbingan] = useState<IBimbingan | null>(null);
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
        if (!response.ok) throw new Error('Failed to fetch student data');
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student data:', error);
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

  const handleOpenBimbinganKPModal = () => {
    setIsBimbinganKPModalOpen(true);
  };


  if (loading || !student) return <Loading/>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-100 to-blue-100 p-4">
          <h1 className="text-center text-sm sm:text-base lg:text-lg font-bold text-gray-800">
            {student.judulKP}
          </h1>
        </div>

        <div className="bg-white rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
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
                    <p className="font-semibold text-gray-800">{student.nama}</p>
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
                    <p className="font-semibold text-gray-800">{student.dosenPembimbing}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="text-cyan-600" />
                  <div>
                    <p className="text-sm text-gray-500">Pembimbing Instansi</p>
                    <p className="font-semibold text-gray-800">{student.pembimbingInstansi}</p>
                  </div>
                </div>
                {/* <div className="flex items-center space-x-3 md:col-span-2">
                  <Mail className="text-cyan-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{student.email}</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white-50">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Riwayat Bimbingan</h2>
          <div className="bg-[#D9F9FF] rounded-xl shadow-md overflow-hidden h-auto overflow-y-auto">
            <table className="w-full">
              <thead className="bg-[#F0F9FF]">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Tanggal</th>
                  <th className="py-3 px-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {student.bimbingan.map((bimbingan, index) => (
                  <tr key={index} className="border-b border-gray-100 transition-colors">
                    <td className="py-3 px-4 text-gray-700">
                      {formatDate(bimbingan.tanggal.toString())}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="text-teal-600 hover:text-teal-800 font-medium px-3 py-1 rounded-full hover:bg-teal-50 transition-colors"
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
          
          <div className="flex justify-center mt-4">
            <button
              className="flex items-center bg-teal-600 text-white 
              px-6 py-3 rounded-full shadow-lg hover:bg-teal-700 
              transition-colors group"
              onClick={handleOpenBimbinganKPModal}
            >
              <Plus className="mr-2 group-hover:rotate-90 transition-transform" />
              Buat Laporan Bimbingan Mahasiswa
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      {isBimbinganKPModalOpen && (
        <AddBimbinganModal
          isOpen={isBimbinganKPModalOpen}
          onClose={() => setIsBimbinganKPModalOpen(false)}
        />
      )}
    </div>

  );
};

export default WithAuth(BimbinganKPPage, ["dosen-pembimbing"]);