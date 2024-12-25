import { Document, Schema, Types, model, models } from "mongoose";

export interface IBimbingan extends Document {
  _id: Types.ObjectId;
  nip: string;
  tanggal: Date;
  komentar: string;
  status: string;
}

const BimbinganSchema = new Schema<IBimbingan>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  nip: { type: String },
  tanggal: { type: Date, required: true },
  komentar: { type: String, required: true },
  status: { type: String },
});

BimbinganSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.id;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

class BimbinganClass {
  private model;

  constructor() {
    this.model = models.Bimbingan || model<IBimbingan>("Bimbingan", BimbinganSchema);
  }

  async create(data: Partial<IBimbingan>): Promise<IBimbingan> {
    const Bimbingan = new this.model(data);
    return Bimbingan.save();
  }

  async findAll(): Promise<IBimbingan[]> {
    return this.model.find({});
  }

  async findById(id: string): Promise<IBimbingan | null> {
    return this.model.findById(id);
  }

  async update(
    id: string,
    data: Partial<IBimbingan>
  ): Promise<IBimbingan | null> {
    return this.model
      .findByIdAndUpdate(id, data, { new: true })
  }

  async delete(id: string): Promise<IBimbingan | null> {
    return this.model.findByIdAndDelete(id);
  }
}

const Bimbingan = new BimbinganClass();

export default Bimbingan;
