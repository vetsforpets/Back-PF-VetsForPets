import { InjectRepository } from "@nestjs/typeorm";
import { MedicalRecord } from "./entity/medical-record.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { MedicalRecordDto } from "./dto/medical-record.dto";
import { UpdateMedicalRecordDto } from "./dto/update-medical-record.dto";




export class MedicalRecordRepository {

    constructor(
        @InjectRepository(MedicalRecord) private readonly medicalRecordRepository: Repository<MedicalRecord>,

    ) { }




    async addRecord(record: MedicalRecordDto) {

        const newRecord = await this.medicalRecordRepository.save(record)

        return { message: "Registro agregado con éxito!", newRecord }
    }


    async findById(recordId: string) {

        const recordFound = await this.medicalRecordRepository.findOne({ where: { id: recordId } })

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