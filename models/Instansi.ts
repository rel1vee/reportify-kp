import { Document, Schema, model, models } from "mongoose";

export interface IInstansi extends Document {
  email: string;
  nip: string;
  nama: string;
  instansi: string;
  jabatanInstansi: string;
}

const InstansiSchema = new Schema<IInstansi>(
  {
    email: { type: String, required: true },
    nip: { type: String, required: true },
    nama: { type: String, required: true },
    instansi: { type: String, required: true },
    jabatanInstansi: { type: String },
  },
  { timestamps: true }
);

InstansiSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.id;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

class InstansiClass {
  private model;

  constructor() {
    this.model = models.Instansi || model<IInstansi>("Instansi", InstansiSchema);
  }

  async create(data: Partial<IInstansi>): Promise<IInstansi> {
    const instansi = new this.model(data);
    return instansi.save();
  }

  async findByEmail(email: string): Promise<IInstansi | null> {
    return this.model.findOne({ email });
  }

  async findByInstansi(instansi: string): Promise<IInstansi | null> {
    return this.model.findOne({ instansi });
  }

  async findAll(): Promise<IInstansi[]> {
    return this.model.find();
  }
}

const Instansi = new InstansiClass();

export default Instansi;
