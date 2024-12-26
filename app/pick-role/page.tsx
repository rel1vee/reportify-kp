"use client";

import React from "react";
import { UserCog, Building2, ArrowRight } from "lucide-react";

const PickRolePage = () => {
  const handleRoleSelect = (role: string) => {
    if (role === "dosen-pembimbing") {
      window.location.href = "/dosen-pembimbing";
    } else if (role === "pembimbing-instansi") {
      window.location.href = "/pembimbing-instansi";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Pilih Peran Anda
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Silahkan pilih peran Anda untuk melanjutkan ke dashboard yang
          sesuai...
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <button
          onClick={() => handleRoleSelect("dosen-pembimbing")}
          className="group bg-white rounded-xl shadow-md hover:shadow-xl p-8 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
              <UserCog className="w-10 h-10 text-gray-800" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Dosen Pembimbing
            </h2>
            <span className="flex items-center text-gray-900 font-medium">
              Masuk ke Dashboard
              <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </div>
        </button>
        <button
          onClick={() => handleRoleSelect("pembimbing-instansi")}
          className="group bg-white rounded-xl shadow-md hover:shadow-xl p-8 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300">
              <Building2 className="w-10 h-10 text-gray-800" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Pembimbing Instansi
            </h2>
            <span className="flex items-center text-gray-900 font-medium">
              Masuk ke Dashboard
              <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PickRolePage;
