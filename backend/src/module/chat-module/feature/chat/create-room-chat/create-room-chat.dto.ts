import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateRoomChatDto {
    @IsUUID()
    member_uuid: string;

    @IsUUID()
    room_uuid: string;

    @IsUUID()
    @IsOptional()
    parent_uuid: string;

    @IsString()
    @MinLength(1)
    @MaxLength(2000)
    message: string
}