import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Admin } from 'src/decorators/roles/admin.decorator';

@ApiTags('Files')
@UseGuards(RolesGuard)
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

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
  @Roles(Role.USER, Role.PETSHOP)
  @ApiBearerAuth()
  @Admin()
  @ApiOperation({ summary: 'Subir imagen de usuario' })
  @ApiCreatedResponse({ description: 'Imagen de usuario subida con éxito' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: "La imagen no puede ser mayor de 200kb",
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|pdf)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('id', ParseUUIDPipe) id: string,
  ) {
    return this.fileUploadService.uploadUserImage(file, id);
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
  @Roles(Role.USER)
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir imagen de mascota' })
  @ApiCreatedResponse({ description: 'Imagen de mascota subida con éxito' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  uploadPetImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2000000,
            message: "El archivo no puede ser mayor de 200kb",
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|pdf)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('id', ParseUUIDPipe) id: string,
  ) {
    return this.fileUploadService.uploadPetImage(file, id);
  }
}