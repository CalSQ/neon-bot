import { Prop } from '@nestjs/mongoose';

export class BaseSchema {
  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  lastModified: Date;
}
