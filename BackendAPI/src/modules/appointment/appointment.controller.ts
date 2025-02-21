import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AppointmentService } from "./appointment.service";
import { AppointmentDto } from "./dto/appointment.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "src/decorators/roles/roles.decorator";
import { Role } from "../common/enums/roles.enum";
import { Admin } from "src/decorators/roles/admin.decorator";
import { Users } from "../users/entity/users.entity";


@ApiTags('Appointments')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentController {

    constructor(private readonly appointmentService: AppointmentService) { }

    @Admin()
    @Roles(Role.USER)
    @Post('schedule')
    makeAppointment(@Req() req: Request & { user: Partial<Users> }, @Body() appointment: AppointmentDto) {

        const { user } = req
        return this.appointmentService.makeAppointment(appointment, user.id)
    }

    @Admin()
    @Roles(Role.PETSHOP)
    @Get()
    findAll() {
        return this.appointmentService.findAll()
    }

    @Admin()
    @Roles(Role.PETSHOP)
    @Get(':id')
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.appointmentService.findById(id)
    }

    @Admin()
    @Roles(Role.PETSHOP, Role.USER)
    @Put('cancel/:id')
    cancelAppointment(@Param('id', ParseUUIDPipe) id: string) {
        return this.appointmentService.cancelAppointment(id)
    }
}