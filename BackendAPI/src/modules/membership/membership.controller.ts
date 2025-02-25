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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Admin } from 'src/decorators/roles/admin.decorator';

@ApiTags('Membership')
@UseGuards(RolesGuard)
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get('seeder')
  @ApiBearerAuth()
  @Admin()
  addMembershipSeeder() {
    return this.membershipService.addMembershipSeeder();
  }

  @Post('user/addMembership')
  @ApiBearerAuth()
  @Admin()
  addUserMembership(
    @Query('userId') userId: string,
    @Query('membershipId') membershipId: string,
  ) {
    return this.membershipService.addUserMembership(userId, membershipId);
  }

  @Get()
  @Roles(Role.USER)
  @ApiBearerAuth()
  findAll() {
    return this.membershipService.findAll();
  }

  @Put('update')
  @Admin()
  @ApiBearerAuth()
  updateMembership(@Query('id') id: string, data: UpdateMembershipDto) {
    return this.membershipService.updateMembership(id, data);
  }

  @Put('cancel')
  @Admin()
  @Roles(Role.USER)
  @ApiBearerAuth()
  cancelMembership(
    @Query('userId') userId: string,
    @Query('membershipId') membershipId: string,
  ) {
    return this.membershipService.cancelMembership(userId, membershipId);
  }
}
