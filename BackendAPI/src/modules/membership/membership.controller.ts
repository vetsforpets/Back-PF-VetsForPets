import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { MembershipService } from "./membership.service";
import { UpdateMembershipDto } from "./dto/update-membership.dto";
import { ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "src/decorators/roles/roles.decorator";
import { Role } from "../common/enums/roles.enum";

@ApiTags('Membership')
@UseGuards(RolesGuard)
@Controller('membership')
export class MembershipController {

    constructor(private readonly membershipService: MembershipService) { }


    @Get('seeder')
    @Roles(Role.ADMIN)
    addMembershipSeeder() {
        return this.membershipService.addMembershipSeeder()
    }

    @Post('user/addMembership')
    @Roles(Role.ADMIN)
    addUserMembership(@Query('userId') userId: string, @Query('membershipId') membershipId: string) {
        return this.membershipService.addUserMembership(userId, membershipId)
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll() {
        return this.membershipService.findAll()
    }

    @Put('update')
    @Roles(Role.ADMIN)
    updateMembership(@Query('id') id: string, data: UpdateMembershipDto) {
        return this.membershipService.updateMembership(id, data)
    }

    @Put('cancel')
    @Roles(Role.ADMIN, Role.USER)
    cancelMembership(@Query('userId') userId: string, @Query('membershipId') membershipId: string) {
        return this.membershipService.cancelMembership(userId, membershipId)

    }
}
