import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipRepository } from './membership.repository';
import { EmailService } from '../common/email/email.service';
import { sendEmailDto } from '../common/email/dto/create.email.dto';

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly emailService: EmailService,
  ) {}

  async addMembershipSeeder() {
    return this.membershipRepository.addMembershipSeeder();
  }

  async findAll() {
    return this.membershipRepository.findAll();
  }

  async updateMembership(id: string, data: UpdateMembershipDto) {
    return this.membershipRepository.updateMembership(id, data);
  }

  async addUserMembership(userId: string, membershipId: string) {
    try {
      const membership = await this.membershipRepository.addUserMembership(
        userId,
        membershipId,
      );

      if (membership && membership.user) {
        try {
          const emailDto: sendEmailDto = {
            recipients: membership.user.email,
            subject: '¡Bienvenido(a) a tu nueva membresía en VetsForPets!',
            html: `
                            <p>¡Hola ${membership.user.name}!</p>
                            <p>¡Has adquirido la membresía ${membership.user.userMembership.membership.name || 'Desconocida'} exitosamente!</p>
                            <p>¡Disfruta de los beneficios!</p>
                            <p>Atentamente,<br>El equipo de VetsForPets</p>
                        `,
          };
          await this.emailService.sendEmail(emailDto);
        } catch (emailError) {
          console.error(
            'Error al enviar email de confirmación de membresía:',
            emailError,
          );
        }
      }
      return membership;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al agregar la membresía al usuario.',
      );
    }
  }

  async findOneMembership(membershipId: string) {
    return this.membershipRepository.findOneMembership(membershipId);
  }
}
