import { IBimbingan } from "./Bimbingan";
import { IDailyReport } from "./DailyReport";
import { Document, Schema, Types, model, models } from "mongoose";

export interface IMahasiswa extends Document {
  email: string;
  nim: string;
  nama: string;
  judulKP: string;
  instansi: string;
  pembimbingInstansi: string;
  dosenPembimbing: string;
  mulaiKP: Date;
  selesaiKP: Date;
  reports: Types.ObjectId[] | IDailyReport[];
  bimbingan: Types.ObjectId[] | IBimbingan[];
}

const MahasiswaSchema = new Schema<IMahasiswa>(
  {
    email: { type: String, required: true },
    nim: { type: String, required: true },
    nama: { type: String, required: true },
    judulKP: { type: String, required: true },
    instansi: { type: String, required: true },
    pembimbingInstansi: { type: String, required: true },
    dosenPembimbing: { type: String, required: true },
    mulaiKP: { type: Date, required: true },
    selesaiKP: { type: Date, required: false },
    reports: [{ type: Schema.Types.ObjectId, ref: "DailyReport" }],
    bimbingan: [{ type: Schema.Types.ObjectId, ref: "Bimbingan" }],
  },
  { timestamps: true }
);

MahasiswaSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.id;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

export const MahasiswaModel =
  models.Mahasiswa || model<IMahasiswa>("Mahasiswa", MahasiswaSchema);

class MahasiswaClass {
  private model;

  constructor() {
    this.model = MahasiswaModel;
  }

  async create(data: Partial<IMahasiswa>): Promise<IMahasiswa> {
    const mahasiswa = new this.model(data);
    return mahasiswa.save();
  }

  async findByEmail(email: string): Promise<IMahasiswa | null> {
    return this.model
      .findOne({ email })
      .populate("reports")
      .populate("bimbingan");
  }

  async findByPembimbingInstansi(
    pembimbingInstansi: string
  ): Promise<IMahasiswa[]> {
    return this.model.find({ pembimbingInstansi }).populate("reports");
  }

  async findByDosenPembimbing(dosenPembimbing: string): Promise<IMahasiswa[]> {
    return this.model
      .find({ dosenPembimbing })
      .populate("reports")
      .populate("bimbingan");
  }

  async findAll(): Promise<IMahasiswa[]> {
    return this.model.find().populate("reports").populate("bimbingan");
  }

  async addReport(
    email: string,
    reportId: Types.ObjectId
  ): Promise<IMahasiswa | null> {
    return this.model
      .findOneAndUpdate(
        { email },
        { $push: { reports: reportId } },
        { new: true }
      )
      .populate("reports");
  }

  async getReports(email: string): Promise<IMahasiswa | null> {
    return this.model.findOne({ email }).populate({
      path: "reports",
      options: { sort: { tanggal: -1 } },
    });
  }

  async addBimbingan(
    email: string,
    bimbinganId: Types.ObjectId
  ): Promise<IMahasiswa | null> {
    return this.model
      .findOneAndUpdate(
        { email },
        { $push: { bimbingan: bimbinganId } },
        { new: true }
      )
      .populate("bimbingan");
  }

  async getBimbingan(email: string): Promise<IMahasiswa | null> {
    return this.model.findOne({ email }).populate({
      path: "bimbingan",
      options: { sort: { tanggal: -1 } },
    });
  }
}

const Mahasiswa = new MahasiswaClass();

export default Mahasiswa;
