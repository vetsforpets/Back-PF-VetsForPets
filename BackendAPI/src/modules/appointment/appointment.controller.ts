import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { AppointmentService } from "./appointment.service";
import { AppointmentDto } from "./dto/appointment.dto";
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiBearerAuth } from "@nestjs/swagger";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "src/decorators/roles/roles.decorator";
import { Role } from "../common/enums/roles.enum";
import { Admin } from "src/decorators/roles/admin.decorator";

@ApiTags('Appointments')
@UseGuards(RolesGuard)
@Controller('appointments')
export class AppointmentController {

    constructor(private readonly appointmentService: AppointmentService) { }

    @ApiBearerAuth()
    @Roles(Role.USER)
    @Admin()
    @Post('schedule')
    @ApiOperation({ summary: 'Agendar una cita' })
    @ApiCreatedResponse({ description: 'Cita agendada con éxito' })
    @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
    @ApiUnauthorizedResponse({ description: 'No autorizado' })
    @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
    makeAppointment(@Body() appointment: AppointmentDto) {
        return this.appointmentService.makeAppointment(appointment);
    }

    @ApiBearerAuth()
    @Roles(Role.PETSHOP)
    @Admin()
    @Get()
    @ApiOperation({ summary: 'Obtener todas las citas' })
    @ApiOkResponse({ description: 'Lista de citas obtenida con éxito' })
    @ApiUnauthorizedResponse({ description: 'No autorizado' })
    @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
    findAll() {
        return this.appointmentService.findAll();
    }

    @ApiBearerAuth()
    @Roles(Role.PETSHOP)
    @Admin()
    @Get(':id')
    @ApiOperation({ summary: 'Obtener cita por ID' })
    @ApiOkResponse({ description: 'Cita encontrada con éxito' })
    @ApiNotFoundResponse({ description: 'Cita no encontrada' })
    @ApiUnauthorizedResponse({ description: 'No autorizado' })
    @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.appointmentService.findById(id);
    }

    @ApiBearerAuth()
    @Roles(Role.PETSHOP, Role.USER)
    @Admin()
    @Put('cancel/:id')
    @ApiOperation({ summary: 'Cancelar cita por ID' })
    @ApiOkResponse({ description: 'Cita cancelada con éxito' })
    @ApiNotFoundResponse({ description: 'Cita no encontrada' })
    @ApiUnauthorizedResponse({ description: 'No autorizado' })
    @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
    cancelAppointment(@Param('id', ParseUUIDPipe) id: string) {
        return this.appointmentService.cancelAppointment(id);
    }
}