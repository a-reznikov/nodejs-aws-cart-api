import { IsString, IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
