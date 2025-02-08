import { BadRequestException, Injectable } from "@nestjs/common";
import { FileUploadRepository } from "./file-upload.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../users/entity/users.entity";
import { Repository } from "typeorm";


@Injectable()
export class FileUploadService {
    constructor(
        private readonly fileUploadRepository: FileUploadRepository,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) { }

    async uploadUserImage(file: Express.Multer.File, id: string) {

        const user = this.usersRepository.findOne({ where: { id } })

        if (!user) throw new BadRequestException("Coloca un ID válido")

        const upload = await this.fileUploadRepository.uploadImage(file)

        await this.usersRepository.update(id, { imgProfile: upload.secure_url })

        return await this.usersRepository.findOne({ where: { id } })
    }
}