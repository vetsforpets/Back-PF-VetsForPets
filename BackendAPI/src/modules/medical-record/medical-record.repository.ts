import { InjectRepository } from "@nestjs/typeorm";
import { MedicalRecord } from "./entity/medical-record.entity";
import { Repository } from "typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { MedicalRecordDto } from "./dto/medical-record.dto";
import { UpdateMedicalRecordDto } from "./dto/update-medical-record.dto";
import { FileUploadService } from "../file-upload/file-upload.service";
import { Pets } from "../pets/entity/pets.entity";
import { PetShop } from "../pet-shop/entity/pet-shop.entity";



@Injectable()
export class MedicalRecordRepository {

    constructor(
        @InjectRepository(MedicalRecord) private readonly medicalRecordRepository: Repository<MedicalRecord>,
        @InjectRepository(Pets) private readonly petsRepository: Repository<Pets>,
        @InjectRepository(PetShop) private readonly petshopRepository: Repository<PetShop>,
        private fileUploadService: FileUploadService,

    ) { }




    async addRecord(record: MedicalRecordDto, petId: string, petshopId: string) {

        const petExists = await this.petsRepository.findOne({ where: { id: petId }, relations: ['medicalRecord'] })

        if (!petExists) throw new BadRequestException("ID de mascota inválido, intenta de nuevo con un ID válido")

        const petshop = await this.petshopRepository.findOne({ where: { id: petshopId } })

        const newRecord = this.medicalRecordRepository.create({ ...record, petshop: petshop })

        await this.medicalRecordRepository.save(newRecord)


        return { message: "Registro agregado con éxito!", newRecord }
    }


    async findById(recordId: string) {

        const recordFound = await this.medicalRecordRepository.findOne({ where: { id: recordId }, relations: ['pet', 'petshop'] })

        if (!recordFound) throw new NotFoundException("ID inválido o registro médico no existe, intenta con un ID válido")

        return recordFound;
    }


    async updateRecord(id: string, data: UpdateMedicalRecordDto) {

        const recordFound = await this.medicalRecordRepository.findOne({ where: { id } })

        if (!recordFound) throw new NotFoundException("ID de registro inválido o el registro no existe, intenta de nuevo con un ID válido")

        await this.medicalRecordRepository.update(id, data)

        const updated = await this.medicalRecordRepository.findOne({ where: { id } })

        return { message: "Registro médico actualizado con éxito", updated }
    }

}