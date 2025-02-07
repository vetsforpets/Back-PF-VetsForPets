import { IsEmail, IsNotEmpty, IsString } from "class-validator";
{ SignUpUserDto } from "./signup.user.dto";
import { PickType } from "@nestjs/swagger";

export class LoginDTO extends PickType(SignUpUserDto, ['email', 'password']){}

