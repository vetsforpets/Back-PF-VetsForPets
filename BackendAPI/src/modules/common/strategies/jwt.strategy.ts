import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import {ExtractJwt, Strategy} from 'passport-jwt'
import { UsersService } from "../../users/users.service"
import { PetShopService } from "../../pet-shop/pet-shop.service"


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly usersService: UsersService,
        private readonly petShopService: PetShopService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: any) {
        try {
            const user = await this.usersService.getUserById(payload.sub);
            if (user) {
              return user
            }
          } catch (error) {
              if(!(error instanceof NotFoundException)){
                  console.error("Error al buscar usuario:", error)
              }
          }
      
          try {
            const petShop = await this.petShopService.getPetShopById(payload.sub);
            if (petShop) {
              return petShop
            }
          } catch (error) {
              if(!(error instanceof NotFoundException)){
                  console.error("Error al obtener las veterinarias:", error);
              }
          }
      
          return null
        }
}