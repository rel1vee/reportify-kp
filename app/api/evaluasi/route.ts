import MongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import EvaluasiDailyReport from "@/models/EvaluasiDailyReport";

interface DailyReportValidation {
  dailyReportId: string;
  nip: string;
  komentar: string;
  status: string;
}

class EvaluasiController {
  async connectDB() {
    try {
      await MongoDB.connect();
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Unable to connect to the database.");
    }
  }

  async getAll() {
    await this.connectDB();
    try {
      const evaluasi = await EvaluasiDailyReport.findAll();
      return NextResponse.json(evaluasi, { status: 200 });
    } catch (error) {
      console.error("Error fetching DailyReports:", error);
      if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(
        { message: "Unknown error occurred." },
        { status: 500 }
      );
    }
  }

  validateCreatePayload(data: Partial<DailyReportValidation>) {
    const requiredFields: (keyof DailyReportValidation)[] = [
      "dailyReportId",
      "nip",
      "komentar",
      "status",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return `${field} is required`;
      }
    }
    return null;
  }

  async create(req: Request) {
    await this.connectDB();
    try {
      const data = await req.json();
      const validationError = this.validateCreatePayload(data);

      if (validationError) {
        return NextResponse.json({ message: validationError }, { status: 400 });
      }

      const newEvaluasiDailyReport = await EvaluasiDailyReport.create(data);
      return NextResponse.json(newEvaluasiDailyReport, { status: 201 });
    } catch (error) {
      console.error("Error creating Evaluasi:", error);
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

      const updatedEvaluasi = await EvaluasiDailyReport.update(_id, data);

      if (!updatedEvaluasi) {
        return NextResponse.json(
          { message: "Evaluasi not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(updatedEvaluasi, { status: 200 });
    } catch (error) {
      console.error("Error updating Evaluasi:", error);
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
  //     const url = new URL(req.url);
  //     const _id = url.pathname.split("/").pop(); // Mengambil ID dari path

  //     if (!_id) {
  //       return NextResponse.json(
  //         { message: "ID (_id) is required" },
  //         { status: 400 }
  //       );
  //     }

  //     const deletedEvaluasi = await EvaluasiDailyReport.delete(_id);

  //     if (!deletedEvaluasi) {
  //       return NextResponse.json(
  //         { message: "Evaluasi not found" },
  //         { status: 404 }
  //       );
  //     }

  //     return NextResponse.json(
  //       { message: "Evaluasi deleted successfully" },
  //       { status: 200 }
  //     );
  //   } catch (error) {
  //     console.error("Error deleting Evaluasi:", error);
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

const evaluasiController = new EvaluasiController();

export async function GET() {
  const response = await evaluasiController.getAll();
  return response;
}
export async function POST(req: Request) {
  return evaluasiController.create(req);
}

export async function PUT(req: Request) {
  return evaluasiController.update(req);
}

// export async function DELETE(req: Request) {
//   return evaluasiController.delete(req);
// }
