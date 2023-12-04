import { Document, Schema, model } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
