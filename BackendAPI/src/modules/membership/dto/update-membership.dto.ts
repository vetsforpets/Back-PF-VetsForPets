import { PartialType } from "@nestjs/swagger";
import { MembershipDto } from "./membership.dto";


export class UpdateMembershipDto extends PartialType(MembershipDto) { }