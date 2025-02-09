import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { AppointmentService } from "./appointment.service";
import { AppointmentDto } from "./dto/appointment.dto";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {

    constructor(private readonly appointmentService: AppointmentService) { }


    @Post('schedule')
    makeAppointment(@Body() appointment: AppointmentDto) {
        return this.appointmentService.makeAppointment(appointment)
    }


    @Get()
    findAll() {
        return this.appointmentService.findAll()
    }


    @Get(':id')
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.appointmentService.findById(id)
    }

    @Put('cancel/:id')
    cancelAppointment(@Param('id', ParseUUIDPipe) id: string) {
        return this.appointmentService.cancelAppointment(id)
    }
}