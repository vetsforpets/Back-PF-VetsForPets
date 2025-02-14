import { BadRequestException, Injectable } from "@nestjs/common";
import { FileUploadRepository } from "./file-upload.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../users/entity/users.entity";
import { Repository } from "typeorm";
import { MedicalRecord } from "../medical-record/entity/medical-record.entity";
import { Pets } from "../pets/entity/pets.entity";


@Injectable()
export class FileUploadService {
    constructor(
        private readonly fileUploadRepository: FileUploadRepository,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        @InjectRepository(MedicalRecord) private medicalRecordRepository: Repository<MedicalRecord>,
        @InjectRepository(Pets) private petsRepository: Repository<Pets>,

    ) { }


    async uploadUserImage(file: Express.Multer.File, id: string) {

        const user = this.usersRepository.findOne({ where: { id } })

        if (!user) throw new BadRequestException("Coloca un ID válido")

        const upload = await this.fileUploadRepository.uploadImage(file)

        await this.usersRepository.update(id, { imgProfile: upload.secure_url })

        return { imgUrl: upload.secure_url }
    }


    async uploadMedicalRecordImage(file: Express.Multer.File, id: string) {

        const record = await this.medicalRecordRepository.findOne({ where: { id } })

        if (!record) throw new BadRequestException("Coloca un ID válido")

        const upload = await this.fileUploadRepository.uploadImage(file)

        if (file.mimetype === 'application/pdf') {

            await this.medicalRecordRepository.update(id, { examResults: [upload.secure_url] })
        }

        await this.medicalRecordRepository.update(id, { image: [upload.secure_url] })

        return {
            fileUrl: upload.secure_url,
            public_id: upload.public_id,
            format: upload.format,
            resource_type: upload.resource_type
        }
    }


    async uploadPetImage(file: Express.Multer.File, id: string) {

        const petFound = await this.petsRepository.findOne({ where: { id } })

        if (!petFound) throw new BadRequestException("ID inválido, intenta de nuevo y coloca un ID válido")

        const upload = await this.fileUploadRepository.uploadImage(file)

        await this.petsRepository.update(id, { profileImg: upload.secure_url })

        return {
            fileUrl: upload.secure_url,
            public_id: upload.public_id,
            format: upload.format,
            resource_type: upload.resource_type
        }


    }


}