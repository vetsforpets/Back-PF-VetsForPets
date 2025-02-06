import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, UploadedFile } from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";


@Controller('files')
export class FileUploadController {

    constructor(private readonly fileUploadService: FileUploadService) { }

    uploadImage(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                    maxSize: 2000000,
                    message: "Image can't be larger than 2mb"
                }),
                new FileTypeValidator({
                    fileType: /(jpg|jpeg|png|webp|pdf)$/,
                }),
            ],
        })
    ) file: Express.Multer.File, @Param('id') id: string) {

    }
}