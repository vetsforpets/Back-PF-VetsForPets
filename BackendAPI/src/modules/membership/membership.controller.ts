import {
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Admin } from 'src/decorators/roles/admin.decorator';

@ApiTags('Memberships')
@UseGuards(RolesGuard)
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get('seeder')
  @ApiBearerAuth()
  @Admin()
  @ApiOperation({ summary: 'Agregar datos de membresías (seeder)' })
  @ApiCreatedResponse({ description: 'Datos de membresías agregados con éxito' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  addMembershipSeeder() {
    return this.membershipService.addMembershipSeeder();
  }

  @Post('user/addMembership')
  @ApiBearerAuth()
  @Admin()
  @ApiOperation({ summary: 'Agregar membresía a un usuario' })
  @ApiCreatedResponse({ description: 'Membresía agregada al usuario con éxito' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiQuery({ name: 'userId', description: 'ID del usuario', required: true })
  @ApiQuery({ name: 'membershipId', description: 'ID de la membresía', required: true })
  addUserMembership(
    @Query('userId') userId: string,
    @Query('membershipId') membershipId: string,
  ) {
    return this.membershipService.addUserMembership(userId, membershipId);
  }

  @Get()
  @Roles(Role.USER)
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las membresías' })
  @ApiOkResponse({ description: 'Lista de membresías obtenida con éxito' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  findAll() {
    return this.membershipService.findAll();
  }

  @Put('update')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar membresía' })
  @ApiOkResponse({ description: 'Membresía actualizada con éxito' })
  @ApiNotFoundResponse({ description: 'Membresía no encontrada' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiQuery({ name: 'id', description: 'ID de la membresía', required: true })
  updateMembership(@Query('id') id: string, data: UpdateMembershipDto) {
    return this.membershipService.updateMembership(id, data);
  }

  @Put('cancel')
  @Admin()
  @Roles(Role.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar membresía de un usuario' })
  @ApiOkResponse({ description: 'Membresía cancelada con éxito' })
  @ApiNotFoundResponse({ description: 'Membresía no encontrada' })
  @ApiBadRequestResponse({ description: 'Solicitud incorrecta' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiQuery({ name: 'userId', description: 'ID del usuario', required: true })
  @ApiQuery({ name: 'membershipId', description: 'ID de la membresía', required: true })
  cancelMembership(
    @Query('userId') userId: string,
    @Query('membershipId') membershipId: string,
  ) {
    return this.membershipService.cancelMembership(userId, membershipId);
  }
}