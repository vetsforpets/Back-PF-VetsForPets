import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Appointment } from "./entity/appointment.entity";
import { Users } from "../users/entity/users.entity";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";
import { AppointmentRepository } from "./appointment.repository";
import { Pets } from "../pets/entity/pets.entity";
import { PetShop } from "../pet-shop/entity/pet-shop.entity";
import { MedicalRecord } from "../medical-record/entity/medical-record.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Appointment, Users, Pets, PetShop, MedicalRecord])],
    controllers: [AppointmentController],
    providers: [AppointmentService, AppointmentRepository]
})
export class AppointmentModule { }