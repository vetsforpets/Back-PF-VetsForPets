import { Module } from "@nestjs/common";
import { CloudinaryConfig } from "src/config/cloudinary";
import { FileUploadController } from "./file-upload.controller";
import { FileUploadService } from "./file-upload.service";
import { FileUploadRepository } from "./file-upload.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../users/entity/users.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    controllers: [FileUploadController],
    providers: [CloudinaryConfig, FileUploadService, FileUploadRepository]
})
export class FileUploadModule { }