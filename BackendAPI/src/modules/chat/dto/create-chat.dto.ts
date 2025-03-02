import { PartialType } from "@nestjs/mapped-types";
import { Chat } from "../entities/chat.entity";

export class CreateChatDto extends PartialType(Chat) { }
