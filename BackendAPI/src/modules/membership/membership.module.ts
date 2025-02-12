import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Membership } from "./entity/membership.entity";
import { MembershipController } from "./membership.controller";
import { MembershipService } from "./membership.service";
import { MembershipRepository } from "./membership.repository";
import { Users } from "../users/entity/users.entity";
import { UserMembership } from "./entity/user-membership.entity";
import { PetShop } from "../pet-shop/entity/pet-shop.entity";



@Module({
    imports: [TypeOrmModule.forFeature([Membership, Users, UserMembership, PetShop])],
    controllers: [MembershipController],
    providers: [MembershipService, MembershipRepository],
    exports: [MembershipService, MembershipRepository]
})
export class MembershipModule {

}