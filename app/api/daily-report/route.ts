import MongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Mahasiswa from "@/models/Mahasiswa";
import DailyReport from "@/models/DailyReport";

interface AgendaItem {
  waktuMulai: string;
  waktuSelesai: string;
  judulAgenda: string;
  deskripsiAgenda: string;
  files?: string[];
}

class DailyReportController {
  async connectDB() {
    try {
      await MongoDB.connect();
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Unable to connect to the database.");
    }
  }

  async getReportsByEmail(req: Request) {
    await this.connectDB();
    try {
      const { searchParams } = new URL(req.url);
      const email = searchParams.get("email");

      if (!email) {
        return NextResponse.json(
          { message: "Email diperlukan" },
          { status: 400 }
        );
      }

      const mahasiswa = await Mahasiswa.findByEmail(email);
      if (!mahasiswa) {
        return NextResponse.json(
          { message: "Mahasiswa tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json(mahasiswa.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(
        { message: "Unknown error occurred." },
        { status: 500 }
      );
    }
  }

  async create(req: Request) {
    await this.connectDB();
    try {
      const { email, tanggal, agenda } = await req.json();

      // Validate mahasiswa exists
      const mahasiswa = await Mahasiswa.findByEmail(email);
      if (!mahasiswa) {
        return NextResponse.json(
          { message: "Mahasiswa tidak ditemukan." },
          { status: 404 }
        );
      }

      const dailyReportData = {
        tanggal: new Date(tanggal),
        agenda: agenda.map((item: AgendaItem) => ({
          waktuMulai: item.waktuMulai,
          waktuSelesai: item.waktuSelesai,
          judulAgenda: item.judulAgenda,
          deskripsiAgenda: item.deskripsiAgenda,
          files: item.files,
        })),
      };

      const newDailyReport = await DailyReport.create(dailyReportData);

      await Mahasiswa.addReport(email, newDailyReport._id);

      return NextResponse.json(
        {
          message: "Laporan berhasil disimpan",
          data: newDailyReport,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating daily report:", error);
      if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(
        { message: "Unknown error occurred." },
        { status: 500 }
      );
    }
  }

  async update(req: Request) {
    await this.connectDB();
    try {
      const { _id, ...data } = await req.json();

      if (!_id) {
        return NextResponse.json(
          { message: "ID (_id) is required" },
          { status: 400 }
        );
      }

      const updatedDailyReport = await DailyReport.update(_id, data);

      if (!updatedDailyReport) {
        return NextResponse.json(
          { message: "DailyReport not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(updatedDailyReport, { status: 200 });
    } catch (error) {
      console.error("Error updating DailyReport:", error);
      if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(
        { message: "Unknown error occurred." },
        { status: 500 }
      );
    }
  }

  // async delete(req: Request) {
  //   await this.connectDB();
  //   try {
  //     const { searchParams } = new URL(req.url);
  //     const _id = searchParams.get("_id");

  //     if (!_id) {
  //       return NextResponse.json(
  //         { message: "ID (_id) is required" },
  //         { status: 400 }
  //       );
  //     }

  //     const deletedDailyReport = await DailyReport.delete(_id);

  //     if (!deletedDailyReport) {
  //       return NextResponse.json(
  //         { message: "DailyReport not found" },
  //         { status: 404 }
  //       );
  //     }

  //     return NextResponse.json(
  //       { message: "DailyReport deleted successfully" },
  //       { status: 200 }
  //     );
  //   } catch (error) {
  //     console.error("Error deleting DailyReport:", error);
  //     if (error instanceof Error) {
  //       return NextResponse.json({ message: error.message }, { status: 500 });
  //     }
  //     return NextResponse.json(
  //       { message: "Unknown error occurred." },
  //       { status: 500 }
  //     );
  //   }
  // }
}

const dailyReportController = new DailyReportController();

export async function GET(req: Request) {
  return dailyReportController.getReportsByEmail(req);
}

export async function POST(req: Request) {
  return dailyReportController.create(req);
}

export async function PUT(req: Request) {
  return dailyReportController.update(req);
}

// export async function DELETE(req: Request) {
//   return dailyReportController.delete(req);
// }
