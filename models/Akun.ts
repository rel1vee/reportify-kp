import { Document, Schema, model, models } from "mongoose";

export interface IAkun extends Document {
  email: string;
  nama: string;
  role: string[];
}

const AkunSchema = new Schema<IAkun>(
  {
    email: { type: String, required: true },
    nama: { type: String, required: true },
    role: { type: [String] },
  },
  { timestamps: true }
);

AkunSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.id;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

class AkunClass {
  private model;

  constructor() {
    this.model = models.Akun || model<IAkun>("Akun", AkunSchema);
  }

  async create(data: Partial<IAkun>): Promise<IAkun> {
    const akun = new this.model(data);
    return akun.save();
  }

  async findByEmail(email: string): Promise<IAkun | null> {
    return this.model.findOne({ email });
  }

  async findByRole(role: string): Promise<IAkun[]> {
    return this.model.find({ role: role });
  }
}

const Akun = new AkunClass();

export default Akun;
