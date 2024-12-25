"use client";

import WithAuth from "@/components/WithAuth";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loading from "@/components/Loading";

interface Student {
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
  reports: Report[];
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

interface BatchSummaryProps {
  onBatchClick: (batch: number) => void;
  selectedBatch: number | null;
  batchData: { batch: number; count: number }[];
}

const BatchSummary: React.FC<BatchSummaryProps> = ({
  onBatchClick,
  selectedBatch,
  batchData,
}) => {
  const fixedBatchRange = Array.from({ length: 5 }, (_, i) => 24 - i);

  const batchMap = batchData.reduce((acc, item) => {
    acc[item.batch] = item.count;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="mt-4">
      <div className="grid grid-cols-5 gap-2 mt-4">
        {fixedBatchRange.map((batch) => (
          <div
            key={batch}
            className={`${
              selectedBatch === batch ? "bg-[#2C707B]" : "bg-gray-800"
            } rounded p-2 text-center cursor-pointer hover:opacity-90 transition-all`}
            onClick={() => onBatchClick(batch)}
          >
            <div className="text-white text-lg font-bold">
              {batchMap[batch] || 0}
            </div>
            <div className="text-gray-200 text-xs">Angkatan {batch}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PembagianMahasiswaPerDosenPembimbing: React.FC<{
  mahasiswa: Student[];
}> = ({ mahasiswa }) => {
  const supervisorData = React.useMemo(() => {
    const supervisorCounts = mahasiswa.reduce((acc, student) => {
      const supervisor = student.dosenPembimbing;
      acc[supervisor] = (acc[supervisor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(supervisorCounts)
      .map(([name, count]) => ({ name, mahasiswa: count }))
      .sort((a, b) => b.mahasiswa - a.mahasiswa);
  }, [mahasiswa]);

  return (
    <div
      className="rounded-xl shadow-md my-8"
      style={{ backgroundColor: "#D9F9FF" }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mt-1 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 pl-1">
            Pembagian Mahasiswa per Dosen Pembimbing
          </h3>
          <div className="text-gray-600 text-sm pr-1">
            Total Mahasiswa:{" "}
            {supervisorData.reduce((sum, item) => sum + item.mahasiswa, 0)}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={supervisorData}>
            <XAxis
              dataKey="name"
              angle={-50}
              textAnchor="end"
              interval={0}
              height={100}
              style={{ fontSize: "12px" }}
            />
            <YAxis type="number" domain={[0, "dataMax"]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="mahasiswa" fill="#2C707B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DashboardKoordinatorPage = () => {
  const [mahasiswa, setMahasiswa] = useState<Student[]>([]);
  const [currentDate, setCurrentDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const today = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    } as const;
    setCurrentDate(today.toLocaleDateString("id-ID", options));

    const fetchMahasiswa = async () => {
      try {
        const response = await fetch("/api/mahasiswa");
        if (!response.ok) throw new Error("Failed to fetch mahasiswa");
        const data = await response.json();
        setMahasiswa(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMahasiswa();
  }, []);

  const getBatchFromNIM = (nim: string) => parseInt(nim.substring(1, 3));

  const calculateBatchData = () => {
    const batchCounts = mahasiswa.reduce((acc, student) => {
      const batch = getBatchFromNIM(student.nim);
      acc[batch] = (acc[batch] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(batchCounts)
      .map(([batch, count]) => ({ batch: parseInt(batch), count }))
      .sort((a, b) => b.batch - a.batch);
  };

  const batchData = calculateBatchData();

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredData = selectedBatch
    ? mahasiswa.filter(
        (student) => getBatchFromNIM(student.nim) === selectedBatch
      )
    : mahasiswa;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleBatchClick = (batch: number) => {
    setSelectedBatch(batch === selectedBatch ? null : batch);
    setCurrentPage(1);
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen p-8 text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="px-7 lg:px-8 pt-16 lg:pt-0">
      <div className="my-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[#C5C5C5]">{currentDate}</p>
      </div>

      <div
        className="rounded-xl shadow-md"
        style={{ backgroundColor: "#D9F9FF" }}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mt-1 mb-4 text-gray-800">
            Mahasiswa KP Teknik Informatika
            {selectedBatch && (
              <span className="ml-2 text-gray-800">
                (Angkatan {selectedBatch})
              </span>
            )}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-m text-left text-gray-700">
              <thead
                className="text-sm text-gray-800 uppercase"
                style={{ backgroundColor: "#C4F4FF" }}
              >
                <tr>
                  <th className="p-2">No.</th>
                  <th className="p-2">Nama Mahasiswa</th>
                  <th className="p-2">NIM</th>
                  <th className="p-2">Tanggal Mulai</th>
                  <th className="p-2">Tanggal Selesai</th>
                  <th className="p-2">Durasi KP</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((student, index) => (
                  <tr
                    key={student._id}
                    className="border-b border-white hover:bg-white"
                  >
                    <td className="p-2">{startIndex + index + 1}</td>
                    <td className="p-2">{student.nama}</td>
                    <td className="p-2">{student.nim}</td>
                    <td className="p-2">
                      {new Date(student.mulaiKP).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-2">
                      {new Date(student.selesaiKP).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-2">
                      {calculateDuration(student.mulaiKP, student.selesaiKP)}{" "}
                      Hari
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-end text-gray-700 mt-2 space-x-2 px-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 text-gray-700 hover:text-gray-900 disabled:text-gray-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs">
                {startIndex + 1}-{Math.min(endIndex, filteredData.length)}/
                {filteredData.length}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 text-gray-700 hover:text-gray-900 disabled:text-gray-400"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <BatchSummary
              batchData={batchData}
              selectedBatch={selectedBatch}
              onBatchClick={handleBatchClick}
            />
          </div>
        </div>
      </div>

      <PembagianMahasiswaPerDosenPembimbing mahasiswa={mahasiswa} />
    </div>
  );
};

export default WithAuth(DashboardKoordinatorPage, ["koordinator"]);
