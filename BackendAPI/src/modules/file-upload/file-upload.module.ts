import { Module } from "@nestjs/common";
import { CloudinaryConfig } from "src/config/cloudinary";
import { FileUploadController } from "./file-upload.controller";
import { FileUploadService } from "./file-upload.service";
import { FileUploadRepository } from "./file-upload.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../users/entity/users.entity";
import { MedicalRecord } from "../medical-record/entity/medical-record.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Users, MedicalRecord])],
    controllers: [FileUploadController],
    providers: [CloudinaryConfig, FileUploadService, FileUploadRepository],
    exports: [FileUploadService, FileUploadRepository]
})
export class FileUploadModule { }