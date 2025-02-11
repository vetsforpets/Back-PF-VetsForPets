import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { MembershipService } from "./membership.service";
import { MembershipDto } from "./dto/membership.dto";
import { UpdateMembershipDto } from "./dto/update-membership.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Membership')
@Controller('membership')
export class MembershipController {

    constructor(private readonly membershipService: MembershipService) { }


    @Get('seeder')
    addMembershipSeeder() {
        return this.membershipService.addMembershipSeeder()
    }

    @Post('user/addMembership')
    addUserMembership(@Query('userId') userId: string, @Query('membershipId') membershipId: string) {
        return this.membershipService.addUserMembership(userId, membershipId)
    }

    @Get()
    findAll() {
        return this.membershipService.findAll()
    }

    @Put('update')
    updateMembership(@Query('id') id: string, data: UpdateMembershipDto) {
        return this.membershipService.updateMembership(id, data)
    }

    @Put('cancel')
    cancelMembership(@Query('userId') userId: string) {
        return this.membershipService.cancelMembership(userId)

    }
}
