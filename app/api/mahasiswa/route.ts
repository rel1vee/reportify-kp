import "@/models/Bimbingan";
import "@/models/DailyReport";
import MongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Mahasiswa from "@/models/Mahasiswa";

class MahasiswaController {
  async connectDB() {
    try {
      await MongoDB.connect();
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Unable to connect to the database.");
    }
  }

  async createMahasiswa(req: Request) {
    await this.connectDB();
    try {
      const {
        email,
        nim,
        nama,
        judulKP,
        instansi,
        pembimbingInstansi,
        dosenPembimbing,
        mulaiKP,
        selesaiKP,
      } = await req.json();
      const existingMahasiswa = await Mahasiswa.findByEmail(email);
      if (existingMahasiswa) {
        return NextResponse.json(existingMahasiswa, { status: 200 });
      }
      const newMahasiswa = await Mahasiswa.create({
        email,
        nim,
        nama,
        judulKP,
        instansi,
        pembimbingInstansi,
        dosenPembimbing,
        mulaiKP,
        selesaiKP,
      });
      return NextResponse.json(newMahasiswa, { status: 201 });
    } catch (error) {
      console.error("Error creating Mahasiswa:", error);
      if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(
        { message: "Unknown error occurred." },
        { status: 500 }
      );
    }
  }

  async getMahasiswa(req: Request) {
    await this.connectDB();
    try {
      const url = new URL(req.url);
      const email = url.searchParams.get("email");
      const pembimbingInstansi = url.searchParams.get("pembimbingInstansi");
      const dosenPembimbing = url.searchParams.get("dosenPembimbing");

      if (email) {
        const mahasiswa = await Mahasiswa.findByEmail(email);
        if (!mahasiswa) {
          return NextResponse.json(
            { message: "Mahasiswa not found." },
            { status: 404 }
          );
        }
        return NextResponse.json(mahasiswa, { status: 200 });
      }

      if (pembimbingInstansi) {
        const mahasiswa = await Mahasiswa.findByPembimbingInstansi(
          pembimbingInstansi
        );
        if (!mahasiswa) {
          return NextResponse.json(
            { message: "Mahasiswa not found." },
            { status: 404 }
          );
        }
        return NextResponse.json(mahasiswa, { status: 200 });
      }

      if (dosenPembimbing) {
        const mahasiswa = await Mahasiswa.findByDosenPembimbing(
          dosenPembimbing
        );
        if (!mahasiswa) {
          return NextResponse.json(
            { message: "Mahasiswa not found." },
            { status: 404 }
          );
        }
        return NextResponse.json(mahasiswa, { status: 200 });
      }

      // Jika tidak ada parameter, kembalikan semua mahasiswa
      const allMahasiswa = await Mahasiswa.findAll();
      return NextResponse.json(allMahasiswa, { status: 200 });
    } catch (error) {
      console.error("Error fetching Mahasiswa:", error);
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

const mahasiswaController = new MahasiswaController();

export async function POST(req: Request) {
  return mahasiswaController.createMahasiswa(req);
}

export async function GET(req: Request) {
  return mahasiswaController.getMahasiswa(req);
}
