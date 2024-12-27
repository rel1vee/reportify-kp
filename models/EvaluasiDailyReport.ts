import { Document, Schema, model, models, Types } from "mongoose";

export interface IEvaluasiDailyReport extends Document {
  dailyReportId?: Types.ObjectId;
  nip: string;
  komentar: string;
  status: string;
}

const EvaluasiDailyReportSchema = new Schema<IEvaluasiDailyReport>({
  dailyReportId: {
    type: Schema.Types.ObjectId,
    ref: "DailyReport",
    required: true,
  },
  nip: { type: String, required: true },
  komentar: { type: String, required: true },
  status: { type: String, required: true },
});

EvaluasiDailyReportSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.id;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

class EvaluasiDailyReportClass {
  private model;

  constructor() {
    this.model =
      models.EvaluasiDailyReport ||
      model<IEvaluasiDailyReport>(
        "EvaluasiDailyReport",
        EvaluasiDailyReportSchema
      );
  }

  async getEvaluasiWithDailyReport(evaluasiId: string) {
    return this.model.aggregate([
      {
        $match: { _id: new Types.ObjectId(evaluasiId) },
      },
      {
        $lookup: {
          from: "dailyreports", // Nama koleksi DailyReport
          localField: "dailyReportId", // Field yang mengarah ke DailyReport
          foreignField: "_id", // Field yang ada di DailyReport
          as: "dailyReportInfo", // Nama field baru yang akan berisi informasi dari DailyReport
        },
      },
      {
        $unwind: "$dailyReportInfo", // Unwind jika hanya ada satu DailyReport terkait
      },
      {
        $project: {
          nip: 1,
          komentar: 1,
          status: 1,
          dailyReportInfo: 1, // Menampilkan informasi DailyReport yang digabungkan
        },
      },
    ]);
  }

  async create(
    data: Partial<IEvaluasiDailyReport>
  ): Promise<IEvaluasiDailyReport> {
    const evaluasiDailyReport = new this.model(data);
    return evaluasiDailyReport.save();
  }

  async findAll(): Promise<IEvaluasiDailyReport[]> {
    return this.model.find({}).populate("_id");
  }

  async findById(id: string): Promise<IEvaluasiDailyReport | null> {
    return this.model.findById(id).populate("_id");
  }

  async update(
    id: string,
    data: Partial<IEvaluasiDailyReport>
  ): Promise<IEvaluasiDailyReport | null> {
    return this.model
      .findByIdAndUpdate(id, data, { new: true })
      .populate("_id");
  }

  // async delete(id: string): Promise<IEvaluasiDailyReport | null> {
  //   return this.model.findByIdAndDelete(id);
  // }

  async updateStatusInDailyReport(
    evaluasiId: string,
    status: string
  ): Promise<void> {
    const evaluasi = await this.model.findById(evaluasiId);
    if (!evaluasi || !evaluasi.dailyReportId) {
      throw new Error("Evaluasi atau Daily Report tidak ditemukan");
    }

    await models.DailyReport.findByIdAndUpdate(
      evaluasi.dailyReportId,
      { status },
      { new: true }
    );
  }
}

const EvaluasiDailyReport = new EvaluasiDailyReportClass();

export default EvaluasiDailyReport;
