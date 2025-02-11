import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Membership } from "./entity/membership.entity";
import { Repository } from "typeorm";
import { UpdateMembershipDto } from "./dto/update-membership.dto";
import { Users } from "../users/entity/users.entity";
import * as data from "../common/seeders/memberships.json";


@Injectable()
export class MembershipRepository {

    constructor(
        @InjectRepository(Membership) private membershipRepository: Repository<Membership>,
        @InjectRepository(Users) private usersRepository: Repository<Users>
    ) { }


    async addMembershipSeeder() {

        const dbMemberships = await this.membershipRepository.find()

        for (const element of data) {
            const memberships = dbMemberships.find((membership) => membership.name === element.name)

            if (!memberships) {
                const newMembership = new Membership()
                newMembership.name = element.name
                newMembership.price = Number(element.price.toFixed(2))
                newMembership.benefits = element.benefits

                await this.membershipRepository.createQueryBuilder()
                    .insert()
                    .into(Membership)
                    .values(newMembership)
                    .orUpdate(["price", "benefits"], ["name"])
                    .execute()

            }


        }

        return { message: "Membresías agregadas con éxito!" };
    }


    async addUserMembership(userId: string, membershipId: string) {

        const user: Partial<Users> = await this.usersRepository.findOne({ where: { id: userId }, relations: { membership: true } })

        if (!user) throw new NotFoundException("ID de usuario inválido, intenta con un ID válido.")

        const membership = await this.membershipRepository.findOne({ where: { id: membershipId } })

        if (!membership) throw new NotFoundException("ID de membresía inválido, intenta con un ID válido.")

        const startDate = new Date()
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + 1)


        user.membership = membership

        user.membership.startDate = startDate
        user.membership.endDate = endDate
        user.membership.status = true

        // await this.membershipRepository.save(membership)

        user.isPremium = true

        await this.usersRepository.save(user)

        return { message: "Membresía adquirida con éxito!", user }
    }

    async findAll() {
        const membership = await this.membershipRepository.find()

        if (!membership) throw new NotFoundException("No existen membresías registradas.")

        return membership;
    }


    async updateMembership(id: string, data: UpdateMembershipDto) {

        const membership = await this.membershipRepository.findOne({ where: { id } })

        if (!membership) throw new NotFoundException("ID de membresía inválido")

        await this.membershipRepository.update(id, data)

        return { message: "Membresía actualizada con éxito!" }

    }

    async updateUserMembership(id: string, data: UpdateMembershipDto) {
        const user = await this.usersRepository.findOne({ where: { id } })

        if (!user) throw new NotFoundException("ID de usuario inválido, intenta de nuevo con un ID válido")

        await this.usersRepository.update(id, data)

        return { message: "Membresía actualizada con éxito!", user: user.membership }
    }



    async cancelMembership(userId: string) {

        const user = await this.usersRepository.findOne({ where: { id: userId }, relations: { membership: true } })

        user.membership.status = false
        user.isPremium = false

        await this.membershipRepository.save(user)

        return { message: "Membresía cancelada con éxito." }
    }
}