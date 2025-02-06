import { Module } from "@nestjs/common";
import { CloudinaryConfig } from "src/config/cloudinary";
import { FileUploadController } from "./file-upload.controller";
import { FileUploadService } from "./file-upload.service";
import { FileUploadRepository } from "./file-upload.repository";


@Module({
    imports: [],
    controllers: [FileUploadController],
    providers: [CloudinaryConfig, FileUploadService, FileUploadRepository]
})
export class FileUploadModule { }