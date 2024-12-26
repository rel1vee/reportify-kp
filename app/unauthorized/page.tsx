"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft } from "lucide-react";

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-red-50 p-8 text-center transform transition-all hover:shadow-3xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-6 flex justify-center"
        >
          <div className="bg-red-100/50 p-5 rounded-full backdrop-blur-sm">
            <Lock
              className="h-20 w-20 text-red-500 drop-shadow-md"
              strokeWidth={1.2}
            />
          </div>
        </motion.div>
        <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 tracking-tight">
          Akses Ditolak
        </h1>
        <p className="text-gray-600 mb-6 text-base leading-relaxed">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali Sebelumnya
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
