import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Membership } from "./entity/membership.entity";
import { MembershipController } from "./membership.controller";
import { MembershipService } from "./membership.service";
import { MembershipRepository } from "./membership.repository";
import { Users } from "../users/entity/users.entity";
import { UserMembership } from "./entity/user-membership.entity";
import { PetShop } from "../pet-shop/entity/pet-shop.entity";
import { OrderDetails } from "../order-details/entity/order-details.entity";
import { EmailModule } from "../common/email/email.module";
import { EmailService } from "../common/email/email.service";



@Module({
    imports: [TypeOrmModule.forFeature([Membership, Users, UserMembership, PetShop, OrderDetails, OrderDetails]), EmailModule],
    controllers: [MembershipController],
    providers: [MembershipService, MembershipRepository, EmailService],
    exports: [MembershipService, MembershipRepository]
})
export class MembershipModule {

}