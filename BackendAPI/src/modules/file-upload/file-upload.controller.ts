import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, ParseUUIDPipe, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags('Files')
@Controller('files')
export class FileUploadController {

    constructor(private readonly fileUploadService: FileUploadService) { }

    @Post('image/userImage')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Archivo a subir',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },

            },
        },
    })
    uploadImage(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                    maxSize: 200000,
                    message: "Image can't be larger than 200kb"
                }),
                new FileTypeValidator({
                    fileType: /(jpg|jpeg|png|webp|pdf)$/,
                }),
            ],
        })
    ) file: Express.Multer.File, @Query('id', ParseUUIDPipe) id: string) {
        return this.fileUploadService.uploadUserImage(file, id)
    }




    @Post('image/medical_record')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Archivo a subir',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },

            },
        },
    })
    uploadMedicalRecordImage(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                    maxSize: 2000000,
                    message: "File can't be larger than 200kb"
                }),
                new FileTypeValidator({
                    fileType: /(jpg|jpeg|png|webp|pdf)$/,
                }),
            ],
        })
    ) file: Express.Multer.File, @Query('id', ParseUUIDPipe) id: string) {
        return this.fileUploadService.uploadMedicalRecordImage(file, id)
    }




    @Post('image/petImage')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Archivo a subir',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },

            },
        },
    })
    uploadPetImage(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                    maxSize: 2000000,
                    message: "File can't be larger than 200kb"
                }),
                new FileTypeValidator({
                    fileType: /(jpg|jpeg|png|webp|pdf)$/,
                }),
            ],
        })
    ) file: Express.Multer.File, @Query('id', ParseUUIDPipe) id: string) {
        return this.fileUploadService.uploadPetImage(file, id)
    }



}