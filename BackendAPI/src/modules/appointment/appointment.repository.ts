import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "./entity/appointment.entity";
import { Repository } from "typeorm";
import { AppointmentDto } from "./dto/appointment.dto";
import { Users } from "../users/entity/users.entity";
import { StatusEnum } from "../common/enums/status.enum";

@Injectable()
export class AppointmentRepository {

    constructor(
        @InjectRepository(Appointment) private appointmentRepository: Repository<Appointment>,
        @InjectRepository(Users) private usersRepository: Repository<Users>
    ) { }


    async makeAppointment(appointment: AppointmentDto, userId: string) {

        const user = await this.usersRepository.findOne({ where: { id: userId } })

        if (!user) throw new NotFoundException("Usuario no encontrado")

        const newAppointment = await this.appointmentRepository.save(appointment)

        const { password, ...rest } = user

        newAppointment.user = rest

        await this.appointmentRepository.save(newAppointment)

        return { message: "Turno agendado con éxito!", newAppointment }
    }


    async findAll() {
        const appointments = await this.appointmentRepository.find({ relations: ['user'] })

        if (!appointments) throw new NotFoundException("No existen turnos agendados.")

        return appointments;
    }


    async findById(id: string) {

        const appointment = await this.appointmentRepository.findOne({ where: { id }, relations: ['user'] })

        if (!appointment) throw new NotFoundException("ID inválido o el turno no existe, intenta con un ID válido.")

        return appointment
    }


    async cancelAppointment(id: string) {
        const appointment = await this.appointmentRepository.findOne({ where: { id } })

        if (!appointment) throw new NotFoundException("ID inválido o el turno no existe, intenta con un ID válido.")

        appointment.status = StatusEnum.CANCELLED

        await this.appointmentRepository.save(appointment)

        return { message: "El turno fue cancelado con éxito." }
    }



}