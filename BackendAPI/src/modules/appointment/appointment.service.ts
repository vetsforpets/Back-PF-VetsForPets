import { Injectable } from "@nestjs/common";
import { AppointmentRepository } from "./appointment.repository";
import { AppointmentDto } from "./dto/appointment.dto";


@Injectable()
export class AppointmentService {
    constructor(private readonly appointmentRepository: AppointmentRepository) { }

    makeAppointment(appointment: AppointmentDto, userId: string) {
        return this.appointmentRepository.makeAppointment(appointment, userId)
    }


    findAll() {
        return this.appointmentRepository.findAll()
    }


    findById(id: string) {
        return this.appointmentRepository.findById(id)
    }

    cancelAppointment(id: string) {
        return this.appointmentRepository.cancelAppointment(id)
    }


}