"use client";

import Link from "next/link";
import { useState } from "react";
import { useKeycloak } from "@react-keycloak/web";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { keycloak } = useKeycloak();
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const menuItems = [
    {
      href: "/dosen-pembimbing",
      label: "Dashboard",
      icon: (
        <svg
          width="55"
          height="55"
          viewBox="0 0 55 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_82_109)">
            <path
              d="M27.5 13.0396L38.9584 23.3521V41.25H34.375V27.5H20.625V41.25H16.0417V23.3521L27.5 13.0396ZM27.5 6.875L4.58337 27.5H11.4584V45.8333H25.2084V32.0833H29.7917V45.8333H43.5417V27.5H50.4167L27.5 6.875Z"
              fill="#323232"
            />
          </g>
          <defs>
            <clipPath id="clip0_82_109">
              <rect width="55" height="55" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      href: "/dosen-pembimbing/daftar-mahasiswa",
      label: "Mahasiswa",
      icon: (
        <svg
          width="55"
          height="55"
          viewBox="0 0 55 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_514_796)">
            <path
              d="M43.5417 6.87508H41.25V2.29175H36.6667V6.87508H18.3333V2.29175H13.75V6.87508H11.4583C8.91458 6.87508 6.89792 8.93758 6.89792 11.4584L6.875 43.5417C6.875 46.0626 8.91458 48.1251 11.4583 48.1251H43.5417C46.0625 48.1251 48.125 46.0626 48.125 43.5417V11.4584C48.125 8.93758 46.0625 6.87508 43.5417 6.87508ZM43.5417 43.5417H11.4583V20.6251H43.5417V43.5417ZM43.5417 16.0417H11.4583V11.4584H43.5417V16.0417ZM38.9583 27.5001H27.5V38.9584H38.9583V27.5001Z"
              fill="#323232"
            />
          </g>
          <defs>
            <clipPath id="clip0_514_796">
              <rect width="55" height="55" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
  ];

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await keycloak.logout({
        redirectUri: window.location.origin,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Overlay for dark background when mobile menu is open */}
      {isBurgerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsBurgerOpen(false)}
        />
      )}
      {/* Mobile Burger Menu */}
      <div className="lg:hidden w-full bg-[#9FD8E4] p-3 fixed z-20">
        <button
          onClick={() => setIsBurgerOpen(!isBurgerOpen)}
          className="p-2 hover:bg-[#FFBF5F] rounded-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-transform duration-300 ${
              isBurgerOpen ? "rotate-90" : ""
            }`}
          >
            <path
              d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
              fill="#323232"
            />
          </svg>
          <span className="font-bold text-gray-800">Reportify KP</span>
        </button>
        {/* Mobile Menu Items */}
        <div
          className={`absolute w-[96%] top-16 bg-white shadow-lg rounded-xl transform transition-all duration-300 ease-in-out ${
            isBurgerOpen
              ? "translate-y-4 opacity-100 visible"
              : "-translate-y-4 opacity-0 invisible"
          }`}
        >
          <div className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="transform transition-all duration-300 hover:translate-x-2"
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#9FD8E4] group transition-all duration-300"
                    onClick={() => setIsBurgerOpen(false)}
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300">
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-800 group-hover:text-[#2C707B]">
                        {item.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {index === 0 &&
                          "Lihat statistik mahasiswa bimbingan Anda"}
                        {index === 1 && "Daftar mahasiswa bimbingan Anda"}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-4 p-3 rounded-xl hover:bg-[#9FD8E4] group transition-all duration-300"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300">
                    <svg
                      width="55"
                      height="55"
                      viewBox="0 0 39 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_82_80)">
                        <path
                          d="M21.125 12.8333L23.4 15.4L19.175 20.1667H35.75V23.8333H19.175L23.4 28.6L21.125 31.1667L13 22L21.125 12.8333ZM6.5 34.8333H19.5V38.5H6.5C4.7125 38.5 3.25 36.85 3.25 34.8333V9.16667C3.25 7.15 4.7125 5.5 6.5 5.5H19.5V9.16667H6.5V34.8333Z"
                          fill="#323232"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_82_80">
                          <rect
                            width="39"
                            height="44"
                            fill="white"
                            transform="matrix(-1 0 0 1 39 0)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg text-start font-semibold text-gray-800 group-hover:text-[#2C707B]">
                      Keluar
                    </span>
                    <span className="text-sm text-gray-500">
                      Keluar dari aplikasi
                    </span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center min-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:flex-col gap-5 lg:w-[80px] lg:h-[96vh] lg:ml-[22px] bg-[#9FD8E4] p-3 rounded-[20px] transition-all">
          <div className="flex-1">
            <div>
              <ul className="flex lg:flex-col gap-5">
                {menuItems.map((item, index) => (
                  <li key={index} className="relative group">
                    <Link
                      href={item.href}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 p-3 rounded-md transition-all hover:bg-[#FFBF5F]"
                    >
                      {item.icon}
                      <span className="absolute left-[70px] top-1/2 transform -translate-y-1/2 p-2 text-white text-center bg-[#2C707B] opacity-0 invisible transition-all w-28 group-hover:left-[75px] group-hover:opacity-100 group-hover:visible rounded-[10px] z-50">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <ul>
              <li className="relative group">
                <button
                  onClick={handleLogout}
                  className="flex w-14 items-center justify-center gap-2 text-sm font-medium text-gray-500 p-3 rounded-md transition-all hover:bg-[#FFBF5F]"
                >
                  <svg
                    width="55"
                    height="55"
                    viewBox="0 0 39 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_82_80)">
                      <path
                        d="M21.125 12.8333L23.4 15.4L19.175 20.1667H35.75V23.8333H19.175L23.4 28.6L21.125 31.1667L13 22L21.125 12.8333ZM6.5 34.8333H19.5V38.5H6.5C4.7125 38.5 3.25 36.85 3.25 34.8333V9.16667C3.25 7.15 4.7125 5.5 6.5 5.5H19.5V9.16667H6.5V34.8333Z"
                        fill="#323232"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_82_80">
                        <rect
                          width="39"
                          height="44"
                          fill="white"
                          transform="matrix(-1 0 0 1 39 0)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="absolute left-[70px] top-1/2 transform -translate-y-1/2 p-2 text-white text-center w-28 bg-[#2C707B] opacity-0 invisible transition-all group-hover:left-[75px] group-hover:opacity-100 group-hover:visible rounded-[10px] z-50">
                    Keluar
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto justify-center w-full h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
