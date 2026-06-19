import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, Min, Max, MaxLength } from 'class-validator';

export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(40)
    name: string;

    @IsString()
    @MinLength(10)
    @MaxLength(100)
    @IsOptional()
    description: string;
}