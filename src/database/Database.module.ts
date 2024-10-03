import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DATABASE_URL ||
        'mongodb+srv://sage:Ayomideh1....@cluster0.8pvdt.mongodb.net/Cluster0',
    ),
  ],
})
export class DatabaseModule {}
