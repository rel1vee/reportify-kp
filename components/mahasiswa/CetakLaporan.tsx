/* eslint-disable @next/next/no-img-element */
import React, { forwardRef, useEffect, useState } from "react";

interface IEvaluasiDailyReport {
  dailyReportId?: string;
  nip: string;
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

export interface CetakLaporanProps {
  mahasiswaData: IMahasiswa;
  evaluasiData: IEvaluasiDailyReport[];
}

const CetakLaporan = forwardRef<HTMLDivElement, CetakLaporanProps>(
  ({ mahasiswaData, evaluasiData }, ref) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    const [nip, setNip] = useState<string | undefined>("");

    const mergedData = mahasiswaData.reports.map((report) => {
      const matchingEvaluasi = evaluasiData.find(
        (evaluasi) => evaluasi.dailyReportId === report._id
      );

      setNip(matchingEvaluasi?.nip);
      const imgsrc =
        report.agenda?.reduce((acc, ag) => {
          return acc.concat(ag.files || []);
        }, [] as string[]) || [];

      return {
        tanggal: new Date(report.tanggal).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        agenda: report.agenda || [],
        evaluasi: matchingEvaluasi?.komentar || "Tidak Ada Evaluasi.",
        imgsrc: imgsrc,
      };
    });

    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
      const today = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
      };
      setCurrentDate(today.toLocaleDateString("id-ID", options));
    }, []);

    return (
      <div ref={ref} className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            DAILY REPORT KERJA PRAKTIK MAHASISWA
          </h1>
          <h1 className="text-2xl font-bold">
            PROGRAM STUDI TEKNIK INFORMATIKA
          </h1>
        </div>

        {/* Judul KP Section */}
        <h3 className="font-semibold">JUDUL KP</h3>
        <div className="border border-black p-4 mb-4">
          <p>{mahasiswaData.judulKP}</p>
        </div>

        {/* Identitas Mahasiswa Section */}
        <div className="max-w-4xl mx-auto mt-6">
          {/* Baris Pertama */}
          <div className="flex">
            <div className="flex-1 flex flex-col items-start">
              <p className="font-bold mb-1">NAMA MAHASISWA</p>
              <div className="w-full border border-black p-4">
                <p>{mahasiswaData.nama}</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-start">
              <p className="font-bold mb-1">NIM</p>
              <div className="w-full border border-black p-4">
                <p>{mahasiswaData.nim}</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-start">
              <p className="font-bold mb-1">TGL MULAI KP</p>
              <div className="w-full border border-black p-4">
                <p>{formatDate(mahasiswaData.mulaiKP)}</p>
              </div>
            </div>
          </div>

          {/* Baris Kedua */}
          <div className="flex mt-4">
            <div className="flex-1 flex flex-col items-start">
              <p className="font-bold mb-1">DOSEN PEMBIMBING KP</p>
              <div className="w-full border border-black p-4">
                <p>{mahasiswaData.dosenPembimbing}</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-start">
              <p className="font-bold mb-1">PEMBIMBING INSTANSI</p>
              <div className="w-full border border-black p-4">
                <p>{mahasiswaData.pembimbingInstansi}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Daily Report */}
        <table className="w-full border border-black mt-8 mb-8">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2">TANGGAL</th>
              <th className="border border-black p-2 w-2/4">KEGIATAN</th>
              <th className="border border-black p-2 w-1/4">DOKUMENTASI</th>
              <th className="border border-black p-2 w-1/4">
                CATATAN EVALUASI
              </th>
            </tr>
          </thead>
          <tbody>
            {mergedData.map((report, index) => (
              <tr key={index}>
                <td className="border border-black p-2 text-start">
                  {report.tanggal}
                </td>
                <td className="border border-black p-2">
                  {report.agenda && report.agenda.length > 0 ? (
                    report.agenda.map((ag, agIndex) => (
                      <React.Fragment key={agIndex}>
                        <div className="mb-4 font-serif">
                          <span className="font-semibold mb-2 text-sm">
                            <p>{ag.judulAgenda}</p>
                          </span>
                          <p className="font-semibold mb-2 text-sm">
                            {ag.waktuMulai} - {ag.waktuSelesai}
                          </p>
                          <p className="text-xs sm:text-sm mb-2">
                            {ag.deskripsiAgenda}
                          </p>
                        </div>
                        {agIndex < report.agenda.length - 1 && (
                          <hr className="my-8" />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <p>No Agenda Available.</p>
                  )}
                </td>
                <td className="border border-black p-2">
                  {report.imgsrc.length > 0 ? (
                    report.agenda?.map((ag, agIndex) => (
                      <React.Fragment key={agIndex}>
                        {ag.files && ag.files.length > 0 && (
                          <div className="mb-4">
                            {ag.files.map((file, fileIndex) => (
                              <div key={fileIndex} className="mb-4">
                                <img
                                  src={file}
                                  className="size-full mb-2"
                                  alt={`dokumentasi agenda ${agIndex + 1} - ${
                                    fileIndex + 1
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {agIndex < (report.agenda?.length ?? 0) - 1 &&
                          ag.files &&
                          ag.files.length > 0 && <hr className="my-4" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <p>No Images Available.</p>
                  )}
                </td>
                <td className="border border-black p-2">{report.evaluasi}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Kesimpulan Section */}
        <h3 className="font-semibold">KESIMPULAN KEGIATAN KERJA PRAKTIK:</h3>
        <div className="border border-black p-4 mb-2 h-[300px]">
          <p></p>
        </div>
        <p className="mb-8">
          Berdasarkan daily report dan kesimpulan kegiatan KP yang telah selesai
          dilaksanakan oleh mahasiswa, maka yang bersangkutan dinyatakan telah
          selesai melaksanakan KP dan mendapatkan persetujuan untuk{" "}
          <b>mendaftar Diseminasi KP.</b>
        </p>

        {/* Bagian Persetujuan */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 text-start">
            <p>Mengetahui,</p>
            <p>Pembimbing Instansi KP</p>
            <br />
            <br />
            <br />
            <br />
            <br />
            <p>{mahasiswaData.pembimbingInstansi}</p>
            <p>NIP. {nip}</p>
          </div>
          <div className="pl-20 pr-4 py-4 text-start">
            <p>Pekanbaru, {currentDate} 2024</p>
            <p>Mahasiswa yang bersangkutan,</p>
            <br />
            <br />
            <br />
            <br />
            <br />
            <p>{mahasiswaData.nama}</p>
            <p>NIM. {mahasiswaData.nim}</p>
          </div>
        </div>
        <div className="ml-56 mt-8 p-4 text-start">
          <p>Dosen Pembimbing KP</p>
          <br />
          <br />
          <br />
          <br />
          <br />
          <p>{mahasiswaData.dosenPembimbing}</p>
          <p>NIP.</p>
        </div>
      </div>
    );
  }
);

CetakLaporan.displayName = "CetakLaporan";

export default CetakLaporan;
