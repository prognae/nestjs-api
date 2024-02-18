import { ForbiddenException, Injectable } from "@nestjs/common";
import { SignUpDto, SignInDto } from "src/dto";
import * as argon from 'argon2';
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}
    
    signToken(userId: number, email: string): Promise<string> {
        const payload = {
            sub: userId,
            email
        }

        return this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET')
        })
    }

    async signup(dto: SignUpDto) {
        // hashing of password
        const hash = await argon.hash(dto.password)

        // saving created user data in the database
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash: hash,
                firstName: dto.firstName,
                lastName: dto.lastName
            }
        })

        let data = {
            status: 'success',
            message: 'Successful sign up.',
            user: user
        }

        return data
    }

    async login(dto: SignInDto) {
        // find the user in the database by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if(!user) {
            throw new ForbiddenException('Incorrect credentials.')
        }

        const compare = await argon.verify(user.hash, dto.password)

        if(!compare) {
            throw new ForbiddenException('Incorrect credentials.')
        } 
        
        let data = {
            status: 'success',
            message: 'Successful login.',
            token: await this.signToken(user.id, user.email)
        }

        return data
    }
}