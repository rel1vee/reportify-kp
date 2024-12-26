"use client";

import React from "react";
import { motion } from "framer-motion";
import { useKeycloak } from "@react-keycloak/web";
import { MessageCircleQuestion, ArrowLeft } from "lucide-react";

const UnassignPage = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    if (keycloak.authenticated) {
      localStorage.clear();
      keycloak.logout({
        redirectUri: window.location.origin,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-blue-100 p-6 md:p-8 text-center relative transition-all duration-300"
      >
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
            Status Akun
          </h1>
        </div>
        {/* Icon and Status Section */}
        <div className="space-y-6 mb-8">
          <div className="flex justify-center">
            <div className="bg-blue-500/10 p-6 rounded-full">
              <MessageCircleQuestion className="text-blue-500 w-12 h-12 md:w-16 md:h-16 animate-pulse drop-shadow-md" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-blue-800">
              Menunggu Konfirmasi Koordinator KP
            </h2>
            <p className="text-blue-600/80 text-sm md:text-base">
              Hubungi Koordinator KP untuk memberikan anda akses ke dalam sistem
              ini.
            </p>
          </div>
        </div>
        {/* Back Button */}
        <motion.button
          onClick={handleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-xs mx-auto bg-blue-600 text-white py-2.5 px-6 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Kembali</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default UnassignPage;
