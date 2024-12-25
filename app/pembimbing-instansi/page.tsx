"use client";

import WithAuth from "@/components/WithAuth";
import React, { useState, useEffect } from "react";
import { Users, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Loading from "@/components/Loading";

type ActivityCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string | number;
  color: string;
};

interface Student {
  _id: string;
  nama: string;
  nim: string;
  instansi: string;
  judulKP: string;
  mulaiKP: string;
  selesaiKP: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  icon: Icon,
  title,
  value,
  color,
}) => (
  <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 w-full">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="text-white w-5 h-5 md:w-6 md:h-6" />
    </div>
    <div>
      <p className="text-gray-500 text-xs md:text-sm">{title}</p>
      <h3 className="text-lg md:text-xl font-bold">{value}</h3>
    </div>
  </div>
);

const getInitials = (nama?: string) => {
  if (!nama) {
    return "?";
  }
  const words = nama.trim().split(" ");
  return words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
};

const calculateProgress = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.min(Math.max(Math.round((daysPassed / totalDays) * 100), 0), 100);
};

const getStatus = (progress: number) => {
  if (progress === 100) return "Completed";
  if (progress > 0) return "In Progress";
  return "Pending";
};

const StudentCard = ({ student }: { student: Student }) => {
  const progress = calculateProgress(student.mulaiKP, student.selesaiKP);
  const status = getStatus(progress);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#9FD8E4] flex items-center justify-center text-white text-base md:text-xl font-bold">
          {getInitials(student.nama)}
        </div>
        <div>
          <h3 className="font-bold text-base md:text-lg">{student.nama}</h3>
          <p className="text-gray-500 text-sm">{student.nim}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs md:text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gray-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="w-full flex gap-2 mt-4">
          <div className="w-3/4 text-xs md:text-sm">
            <p className="text-gray-500">Periode KP</p>
            <p className="font-semibold">{formatDate(student.mulaiKP.toString())} - {formatDate(student.selesaiKP.toString())}</p>
          </div>
          <div className="w-1/4 text-end text-xs md:text-sm">
            <p className="text-gray-500">Status</p>
            <p className={`font-semibold ${
              status === "Completed" ? "text-purple-600" :
              status === "In Progress" ? "text-green-600" :
              "text-yellow-600"
            }`}>
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPembimbingInstansiPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const pembimbingInstansi = localStorage.getItem('nama');

        if (!pembimbingInstansi) {
          console.error('Pembimbing Instansi not found in localStorage.');
          return;
        }

        const response = await fetch(`/api/mahasiswa?pembimbingInstansi=${encodeURIComponent(pembimbingInstansi)}`);
        const data = await response.json();
        setStudents(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();

    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setCurrentDate(today.toLocaleDateString("id-ID", options));
  }, []);

  const getStatusCounts = () => {
    const counts = {
      total: students.length,
      active: 0,
      completed: 0,
      pending: 0,
    };

    students.forEach(student => {
      const progress = calculateProgress(student.mulaiKP, student.selesaiKP);
      if (progress === 100) counts.completed++;
      else if (progress > 0) counts.active++;
      else counts.pending++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="flex-1 overflow-y-auto justify-center w-full min-h-screen">
      <div className="px-7 lg:px-8 pt-16 lg:pt-0 pb-8">
        <div className="my-8">
          <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
          <p className="text-[#C5C5C5] text-sm">{currentDate}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <ActivityCard
            icon={Users}
            title="Total Students"
            value={statusCounts.total}
            color="bg-blue-500"
          />
          <ActivityCard
            icon={Clock}
            title="Active Internships"
            value={statusCounts.active}
            color="bg-green-500"
          />
          <ActivityCard
            icon={CheckCircle}
            title="Completed"
            value={statusCounts.completed}
            color="bg-purple-500"
          />
          <ActivityCard
            icon={AlertTriangle}
            title="Pending"
            value={statusCounts.pending}
            color="bg-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {students.map((student) => (
            <StudentCard key={student._id} student={student} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WithAuth(DashboardPembimbingInstansiPage, [
  "pembimbing-instansi",
]);
