import { PartialType } from "@nestjs/mapped-types";
import { Message } from "../entities/message.entity";



export class CreateMessageDto extends PartialType(Message) { }