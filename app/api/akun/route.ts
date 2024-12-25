import Akun from "@/models/Akun";
import MongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

class AkunController {
  async connectDB() {
    try {
      await MongoDB.connect();
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Unable to connect to the database.");
    }
  }

  async createAkun(req: Request) {
    await this.connectDB();
    try {
      const { email, nama, role } = await req.json();
      const existingAkun = await Akun.findByEmail(email);
      if (existingAkun) {
        return NextResponse.json(existingAkun, { status: 200 });
      }
      const newAkun = await Akun.create({ email, nama, role });
      return NextResponse.json(newAkun, { status: 201 });
    } catch (error) {
      console.error("Error creating Akun:", error);
      if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(
        { message: "Unknown error occurred." },
        { status: 500 }
      );
    }
  }

  async getAkun(req: Request) {
    await this.connectDB();
    try {
      const url = new URL(req.url);
      const role = url.searchParams.get("role");

      if (role) {
        const akunByRole = await Akun.findByRole(role);
        if (akunByRole.length === 0) {
          return NextResponse.json(
            { message: `No Akun found with role: ${role}` },
            { status: 404 }
          );
        }
        return NextResponse.json(akunByRole, { status: 200 });
      }

      // Jika tidak ada parameter, kembalikan pesan error
      return NextResponse.json(
        {
          message: "Invalid query parameter.",
        },
        { status: 400 }
      );
    } catch (error) {
      console.error("Error fetching Akun:", error);
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

const akunController = new AkunController();

export async function POST(req: Request) {
  return akunController.createAkun(req);
}

export async function GET(req: Request) {
  return akunController.getAkun(req);
}
