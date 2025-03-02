import { Module } from '@nestjs/common';
import { PetShopController } from './pet-shop.controller';
import { PetShopService } from './pet-shop.service';
import { PetShopRepository } from './pet-shop.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetShop } from './entity/pet-shop.entity';
import { Appointment } from '../appointment/entity/appointment.entity';
import { Membership } from '../membership/entity/membership.entity';
import { MedicalRecord } from '../medical-record/entity/medical-record.entity';
import { EmailModule } from '../common/email/email.module';
import { EmailService } from '../common/email/email.service';
import { Location } from '../location/entity/location.entity';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [TypeOrmModule.forFeature([PetShop, Appointment, Membership, MedicalRecord, Location]), EmailModule, LocationModule],
  controllers: [PetShopController],
  providers: [PetShopService, PetShopRepository, EmailService],
  exports: [PetShopService, PetShopRepository]
})
export class PetShopModule { }
