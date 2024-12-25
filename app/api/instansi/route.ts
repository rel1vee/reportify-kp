import MongoDB from "@/libs/mongodb";
import Instansi from "@/models/Instansi";
import { NextResponse } from "next/server";

class InstansiController {
  async connectDB() {
    try {
      await MongoDB.connect();
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Unable to connect to the database.");
    }
  }

  async createInstansi(req: Request) {
    await this.connectDB();
    try {
      const { email, nip, nama, instansi, jabatanInstansi } = await req.json();
      const existingInstansi = await Instansi.findByEmail(email);
      if (existingInstansi) {
        return NextResponse.json(existingInstansi, { status: 200 });
      }
      const newInstansi = await Instansi.create({
        email,
        nip,
        nama,
        instansi,
        jabatanInstansi,
      });
      return NextResponse.json(newInstansi, { status: 201 });
    } catch (error) {
      console.error("Error creating Instansi:", error);
      if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(
        { message: "Unknown error occurred." },
        { status: 500 }
      );
    }
  }

  async getInstansi(req: Request) {
    await this.connectDB();
    try {
      const url = new URL(req.url);
      const email = url.searchParams.get("email");
      const instansi = url.searchParams.get("instansi");

      if (email) {
        // Jika ada parameter email, cari mahasiswa berdasarkan email
        const instansi = await Instansi.findByEmail(email);
        if (!instansi) {
          return NextResponse.json(
            { message: "Instansi not found." },
            { status: 404 }
          );
        }
        return NextResponse.json(instansi, { status: 200 });
      }

      if (instansi) {
        // Jika ada parameter instansi, cari instansi berdasarkan nama instansi
        const namaInstansi = await Instansi.findByInstansi(instansi);
        if (!namaInstansi) {
          return NextResponse.json(
            { message: "Instansi not found." },
            { status: 404 }
          );
        }
        return NextResponse.json(namaInstansi, { status: 200 });
      }

      // Jika tidak ada parameter, kembalikan semua instansi
      const allInstansi = await Instansi.findAll();
      return NextResponse.json(allInstansi, { status: 200 });
    } catch (error) {
      console.error("Error fetching Instansi:", error);
      if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(
        { message: "Unknown error occurred." },
        { status: 500 }
      );
    }
  }
}

const instansiController = new InstansiController();

export async function POST(req: Request) {
  return instansiController.createInstansi(req);
}

export async function GET(req: Request) {
  return instansiController.getInstansi(req);
}
