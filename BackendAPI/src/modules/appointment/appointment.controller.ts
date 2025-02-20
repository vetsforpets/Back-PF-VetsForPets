import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { AppointmentService } from "./appointment.service";
import { AppointmentDto } from "./dto/appointment.dto";
import { ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "src/decorators/roles/roles.decorator";
import { Role } from "../common/enums/roles.enum";
import { Admin } from "src/decorators/roles/admin.decorator";


@ApiTags('Appointments')
@UseGuards(RolesGuard)
@Controller('appointments')
export class AppointmentController {

    constructor(private readonly appointmentService: AppointmentService) { }

    @Roles(Role.USER)
    @Admin()
    @Post('schedule')
    makeAppointment(@Body() appointment: AppointmentDto) {
        return this.appointmentService.makeAppointment(appointment)
    }

    @Roles(Role.PETSHOP)
    @Admin()
    @Get()
    findAll() {
        return this.appointmentService.findAll()
    }

    @Roles(Role.PETSHOP)
    @Admin()
    @Get(':id')
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.appointmentService.findById(id)
    }

    @Roles(Role.PETSHOP, Role.USER)
    @Admin()
    @Put('cancel/:id')
    cancelAppointment(@Param('id', ParseUUIDPipe) id: string) {
        return this.appointmentService.cancelAppointment(id)
    }
}