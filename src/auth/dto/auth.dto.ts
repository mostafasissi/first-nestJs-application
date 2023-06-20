/* eslint-disable prettier/prettier */
import { IsEmail , IsString , IsNotEmpty} from 'class-validator';

/* eslint-disable prettier/prettier */
export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email : string ; 
    
    @IsString()
    @IsNotEmpty()
    password : string ; 
}