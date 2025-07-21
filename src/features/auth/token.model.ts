import { Schema, model, Types } from 'mongoose';

interface IToken {
  token: string;
  userId: string;
  role: string;
}

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

export default model<IToken>('Token', tokenSchema);
