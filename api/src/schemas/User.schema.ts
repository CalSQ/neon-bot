import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { BaseSchema } from './Base.schema';
import { HydratedDocument } from 'mongoose';
import { RobloxProfile } from '../utils/types';

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true, unique: true })
  discordId: string;

  @Prop(
    raw({
      id: { type: String },
      username: { type: String },
      display_name: { type: String },
      profile_url: { type: String },
      picture_url: { type: String },
    }),
  )
  roblox: RobloxProfile;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDoc = HydratedDocument<User>;
