import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { UsersModule } from './modules/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { PetsModule } from './modules/pets/pets.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { MembershipModule } from './modules/membership/membership.module';
import { PetShopModule } from './modules/pet-shop/pet-shop.module';
import { OrderModule } from './modules/order/order.module';
import { OrderDetailsModule } from './modules/order-details/order-details.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { MedicalRecordModule } from './modules/medical-record/medical-record.module';
import { LocationModule } from './modules/location/location.module';
import { PaymentModule } from './modules/payment/payment.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    AuthModule,
    FileUploadModule,
    PetsModule,
    AppointmentModule,
    PetShopModule,
    MembershipModule,
    OrderModule,
    OrderDetailsModule,
    MedicalRecordModule,
    LocationModule,
    PaymentModule

  ],
  controllers: [],
  providers: [JwtService, JwtStrategy],
})
export class AppModule { }
