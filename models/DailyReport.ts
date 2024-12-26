import { Document, Schema, model, Types, models, QueryOptions } from "mongoose";

export interface IDailyReport extends Document {
  _id: Types.ObjectId;
  tanggal: Date;
  agenda?: {
    waktuMulai: string;
    waktuSelesai: string;
    judulAgenda: string;
    deskripsiAgenda: string;
    files: string[];
  };
}

const AgendaSchema = new Schema(
  {
    waktuMulai: { type: String, required: true },
    waktuSelesai: {
      type: String,
      required: true,
    },
    judulAgenda: { type: String, required: true },
    deskripsiAgenda: {
      type: String,
      required: true,
    },
    files: [{ type: String }],
  },
  { _id: false }
);

const DailyReportSchema = new Schema<IDailyReport>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  tanggal: { type: Date, required: [true, "Tanggal diperlukan."] },
  agenda: { type: [AgendaSchema], default: [] },
});

DailyReportSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.id;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

export const DailyReportModel =
  models.DailyReport || model<IDailyReport>("DailyReport", DailyReportSchema);

class DailyReportClass {
  private model;

  constructor() {
    this.model = DailyReportModel;
  }

  async create(data: Partial<IDailyReport>): Promise<IDailyReport> {
    const dailyReport = new this.model(data);
    return dailyReport.save();
  }

  async findAll(): Promise<IDailyReport[]> {
    return this.model.find({});
  }

  async findById(id: string): Promise<IDailyReport | null> {
    return this.model.findById(id);
  }

  async update(
    id: string,
    data: Partial<IDailyReport>
  ): Promise<IDailyReport | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  // async delete(id: string): Promise<IDailyReport | null> {
  //   return this.model.findByIdAndDelete(id);
  // }

  async findByIdAndUpdate(
    id: string,
    data: Partial<IDailyReport>,
    options: QueryOptions
  ) {
    return this.model.findByIdAndUpdate(id, data, options);
  }
}

const DailyReport = new DailyReportClass();

export default DailyReport;
