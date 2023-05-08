import * as mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface UserDocument extends mongoose.Document {
    name: string;
    nickname: string;
    email: string;
    password: string;
    temporaryPassword: string;
    profile: string;
    disabled: boolean;
}

interface UserModel extends mongoose.Model<UserDocument> {
  verifyPassword(password: string, comparePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  nickname: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: false },
  temporaryPassword: { type: String, required: false, unique: false },
  profile: { type: String, required: true, unique: false },
  disabled: { type: Boolean, required: true, unique: false },
})

UserSchema.static('verifyPassword', async function (password: string, comparePassword: string) {
  return await bcrypt.compare(password, comparePassword);
})

export const UserModel = mongoose.model<UserDocument, UserModel>(
  'users',
  UserSchema
)
