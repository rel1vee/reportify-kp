"use client";

import { Save, Upload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useState, useRef, ChangeEvent } from "react";
import NotificationPopup from "@/components/NotificationPopUp";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DayInfo {
  date: Date;
  dayShort: string;
  dayNum: number;
  isToday: boolean;
  isSelected: boolean;
}

interface Agenda {
  waktuMulai: string;
  waktuSelesai: string;
  judulAgenda: string;
  deskripsiAgenda: string;
  date: Date;
  files: string[];
}

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const AddTaskModal = ({ isOpen, onClose }: AddTaskModalProps) => {
  const [Agenda, setAgenda] = useState<Agenda>({
    waktuMulai: "",
    waktuSelesai: "",
    judulAgenda: "",
    deskripsiAgenda: "",
    date: new Date(),
    files: [],
  });

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [agendaList, setAgendaList] = useState<Agenda[]>([]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const formatDayName = (date: Date): string => DAYS[date.getDay()];
  const formatMonthName = (date: Date): string => MONTHS[date.getMonth()];

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAgenda((prev) => ({ ...prev, [name]: value }));
  };

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(Agenda.date);
    newDate.setMonth(monthIndex);
    setAgenda((prev) => ({ ...prev, date: newDate }));
    setIsMonthDropdownOpen(false);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(Agenda.date);
    newDate.setFullYear(year);
    setAgenda((prev) => ({ ...prev, date: newDate }));
    setIsYearDropdownOpen(false);
  };

  const generateDates = (): DayInfo[] => {
    const dates: DayInfo[] = [];
    const startDate = new Date(Agenda.date);
    startDate.setDate(startDate.getDate() - 14);

    for (let i = 0; i < 29; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push({
        date: date,
        dayShort: formatDayName(date),
        dayNum: date.getDate(),
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, Agenda.date),
      });
    }
    return dates;
  };

  const handleDateClick = (date: Date) => {
    setAgenda((prev) => ({ ...prev, date }));
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleImageUpload = (result: any) => {
    if (result.event === "success") {
      const uploadedImageUrl = result.info.secure_url;
      setAgenda((prev) => ({
        ...prev,
        files: [...(prev.files || []), uploadedImageUrl],
      }));
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setAgenda((prev) => ({
      ...prev,
      files: prev.files?.filter((url) => url !== urlToRemove),
    }));
  };

  const handleTambahAgenda = () => {
    if (
      !Agenda.waktuMulai ||
      !Agenda.waktuSelesai ||
      !Agenda.judulAgenda ||
      !Agenda.deskripsiAgenda ||
      !Agenda.files ||
      Agenda.files.length === 0
    ) {
      setNotification({
        message: "Semua field harus diisi, termasuk minimal satu dokumentasi.",
        type: "warning",
      });
      return;
    }

    setAgendaList((prev) => {
      const updatedAgendaList = [...prev, Agenda];

      setNotification({
        message: "Agenda berhasil ditambahkan.",
        type: "success",
      });

      return updatedAgendaList;
    });

    setAgenda((prev) => ({
      ...prev,
      waktuMulai: "",
      waktuSelesai: "",
      judulAgenda: "",
      deskripsiAgenda: "",
      files: [],
    }));
  };

  const handleSubmit = async () => {
    if (agendaList.length === 0 && !Agenda.judulAgenda) {
      setNotification({
        message: "Minimal isi satu agenda.",
        type: "warning",
      });
      return;
    }

    const validAgendas = agendaList.filter(
      (agenda) =>
        agenda.judulAgenda &&
        agenda.deskripsiAgenda &&
        agenda.waktuMulai &&
        agenda.waktuSelesai
    );

    if (Agenda.judulAgenda) {
      validAgendas.push(Agenda);
    }

    const email = localStorage.getItem("email");

    const requestBody = {
      email: email,
      tanggal: Agenda.date,
      agenda: validAgendas.map((agenda) => ({
        waktuMulai: agenda.waktuMulai,
        waktuSelesai: agenda.waktuSelesai,
        judulAgenda: agenda.judulAgenda,
        deskripsiAgenda: agenda.deskripsiAgenda,
        files: agenda.files,
      })),
    };

    try {
      const response = await fetch("/api/daily-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setNotification({
          message: "Laporan berhasil disimpan.",
          type: "success",
        });
      } else {
        setNotification({
          message: `Gagal menyimpan laporan.`,
          type: "error",
        });
      }

      setAgendaList([]);
      setAgenda({
        waktuMulai: "",
        waktuSelesai: "",
        judulAgenda: "",
        deskripsiAgenda: "",
        date: new Date(),
        files: [],
      });

      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setNotification({
          message: `Gagal menyimpan laporan: ${error.message}`,
          type: "error",
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Notification Popup */}
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-xl py-4 px-6 w-[90%] md:max-w-[1000px] h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="w-full text-gray-500 hover:text-red-500 text-end"
          >
            ✕
          </button>
          <h2 className="text-lg font-bold mb-4 text-center -mt-6 lg:-mt-5">
            Tambah Laporan Baru
          </h2>
          <div className="space-y-3">
            {/* Calendar Section */}
            <div className="bg-white p-3 rounded-xl border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {/* Month Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsMonthDropdownOpen(!isMonthDropdownOpen);
                        setIsYearDropdownOpen(false);
                      }}
                      className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 rounded-md text-sm font-medium"
                    >
                      {formatMonthName(Agenda.date)}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isMonthDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isMonthDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-40 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {MONTHS.map((month, index) => (
                          <button
                            key={month}
                            onClick={() => handleMonthChange(index)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                            ${
                              Agenda.date.getMonth() === index
                                ? "bg-gray-50 font-medium"
                                : ""
                            }`}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Year Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsYearDropdownOpen(!isYearDropdownOpen);
                        setIsMonthDropdownOpen(false);
                      }}
                      className="flex items-center gap-1 py-1 px-2 hover:bg-gray-100 rounded-md text-sm font-medium"
                    >
                      {Agenda.date.getFullYear()}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isYearDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isYearDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-24 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {years.map((year) => (
                          <button
                            key={year}
                            onClick={() => handleYearChange(year)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                            ${
                              Agenda.date.getFullYear() === year
                                ? "bg-gray-50 font-medium"
                                : ""
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleScroll("left")}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Scroll left"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleScroll("right")}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Scroll right"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                ref={scrollRef}
                className="flex overflow-x-auto hide-scrollbar gap-3"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {generateDates().map((day, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                    onClick={() => handleDateClick(day.date)}
                  >
                    <span className="text-gray-500 text-sm mb-2">
                      {day.dayShort}
                    </span>
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full text-lg
                      ${
                        day.isSelected
                          ? "bg-[#2C707B] text-white"
                          : day.isToday
                          ? "bg-gray-100"
                          : "hover:bg-gray-200"
                      }
                      transition-colors`}
                    >
                      {day.dayNum}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Time Input Section */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label
                  className="text-xs font-medium text-gray-600"
                  htmlFor="waktuMulai"
                >
                  Jam Masuk
                </label>
                <input
                  id="waktuMulai"
                  name="waktuMulai"
                  type="time"
                  value={Agenda.waktuMulai}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 hover:bg-gray-50 focus:ring-blue-200 focus:border-blue-400 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label
                  className="text-xs font-medium text-gray-600"
                  htmlFor="waktuSelesai"
                >
                  Jam Keluar
                </label>
                <input
                  id="waktuSelesai"
                  name="waktuSelesai"
                  type="time"
                  value={Agenda.waktuSelesai}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 hover:bg-gray-50 focus:ring-blue-200 focus:border-blue-400 outline-none"
                />
              </div>
            </div>
            {/* File Upload Section */}
            <div className="pt-4 flex flex-col items-center">
              {/* Upload Button Section */}
              <CldUploadWidget
                signatureEndpoint="/api/dokumentasi"
                onSuccess={handleImageUpload}
              >
                {({ open }) => (
                  <button
                    onClick={() => open()}
                    className="flex gap-2 justify-center items-center bg-[#2C707B] hover:bg-[#225158] text-white px-4 py-2 rounded-md"
                  >
                    <Upload size={18} />
                    Upload Dokumentasi
                  </button>
                )}
              </CldUploadWidget>
              {/* Image Preview Section */}
              {Agenda.files && Agenda.files.length > 0 && (
                <div className="mt-4 w-full">
                  <div className="flex flex-wrap justify-center gap-2">
                    {Agenda.files.map((fileUrl, index) => (
                      <div key={`uploaded-image-${index}`} className="relative">
                        <img
                          src={String(fileUrl)}
                          alt="Uploaded"
                          className="size-56 object-cover rounded-md"
                        />
                        <button
                          onClick={() => handleRemoveImage(fileUrl.toString())}
                          className="absolute top-0 right-0 bg-red-500 text-white py-1 px-2 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* judulAgenda Input */}
            <div className="space-y-1">
              <label
                className="text-xs font-medium text-gray-600"
                htmlFor="judulAgenda"
              >
                Judul Agenda
              </label>
              <input
                id="judulAgenda"
                name="judulAgenda"
                type="text"
                value={Agenda.judulAgenda}
                onChange={handleInputChange}
                placeholder="Masukkan Judul Agenda"
                className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              />
            </div>
            {/* deskripsiAgenda Input */}
            <div className="space-y-1">
              <label
                className="text-xs font-medium text-gray-600"
                htmlFor="deskripsiAgenda"
              >
                Deskripsi
              </label>
              <textarea
                id="deskripsiAgenda"
                name="deskripsiAgenda"
                value={Agenda.deskripsiAgenda}
                onChange={handleInputChange}
                placeholder="Masukkan Deskripsi Agenda"
                rows={3}
                className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              />
            </div>
            {/* Submit and Add Agenda Buttons */}
            <div className="flex items-center justify-between pt-1">
              {/* Tambah Agenda Button */}
              <button
                onClick={handleTambahAgenda}
                className="bg-[#2C707B] hover:bg-[#225158] text-white rounded-[20px] px-4 py-2 flex justify-center items-center gap-2"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="25" height="25" rx="5" fill="#FFBF5F" />
                  <path
                    d="M17 13.7143H12.7143V18H11.2857V13.7143H7V12.2857H11.2857V8H12.7143V12.2857H17V13.7143Z"
                    fill="#323232"
                  />
                </svg>
                Tambah Agenda
              </button>
              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="flex justify-center items-center bg-[#52BD3A] text-white rounded-[20px] px-4 py-2 gap-2 hover:bg-gradient-to-b from-[#52BD3A] to-[#26571B]"
              >
                <Save size={18} />
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTaskModal;
