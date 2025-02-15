import { Injectable } from '@nestjs/common';
import { MembershipDto } from './dto/membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipRepository } from './membership.repository';

@Injectable()
export class MembershipService {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async addMembershipSeeder() {
    return this.membershipRepository.addMembershipSeeder();
  }

  async addUserMembership(userId: string, membershipId: string) {
    return this.membershipRepository.addUserMembership(userId, membershipId);
  }

  async findAll() {
    return this.membershipRepository.findAll();
  }

  async updateMembership(id: string, data: UpdateMembershipDto) {
    return this.membershipRepository.updateMembership(id, data);
  }

  async cancelMembership(userId: string, membershipId: string) {
    return this.membershipRepository.cancelMembership(userId, membershipId);
  }

  async purchaseMembership(membershipId: string) {
    return this.membershipRepository.purchaseMembership(membershipId);
  }

  async findOneMembership(membershipId: string) {
    return this.membershipRepository.findOneMembership(membershipId);
  }
}
