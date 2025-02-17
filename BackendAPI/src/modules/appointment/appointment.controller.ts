import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { AppointmentService } from "./appointment.service";
import { AppointmentDto } from "./dto/appointment.dto";
import { ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "src/decorators/roles/roles.decorator";
import { Role } from "../common/enums/roles.enum";


@ApiTags('Appointments')
@UseGuards(RolesGuard)
@Controller('appointments')
export class AppointmentController {

    constructor(private readonly appointmentService: AppointmentService) { }

    @Roles(Role.ADMIN, Role.USER)
    @Post('schedule')
    makeAppointment(@Body() appointment: AppointmentDto) {
        return this.appointmentService.makeAppointment(appointment)
    }

    @Roles(Role.ADMIN)
    @Get()
    findAll() {
        return this.appointmentService.findAll()
    }

    @Roles(Role.ADMIN)
    @Get(':id')
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.appointmentService.findById(id)
    }

    @Roles(Role.ADMIN, Role.PETSHOP, Role.USER)
    @Put('cancel/:id')
    cancelAppointment(@Param('id', ParseUUIDPipe) id: string) {
        return this.appointmentService.cancelAppointment(id)
    }
}