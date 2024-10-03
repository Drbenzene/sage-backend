import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { AccountService } from 'src/account/account.service';
import { AccountType } from 'src/database/schemas/accout.schema';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private accountService: AccountService,
    // private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  public async createUser(userData: CreateUserDto): Promise<User> {
    //CHECK USER EMAIL EXISTS
    const emailExist = await this.userModel.findOne({ email: userData.email });
    if (emailExist) {
      throw new UnprocessableEntityException('Email already exists');
    }
    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    userData.password = hashedPassword;
    const newUser = new this.userModel(userData);
    const user = await newUser.save();
    await this.accountService.createAccount({
      balance: 0,
      accountType: AccountType.SAVINGS,
      userId: user._id,
    });

    return user;
  }

  public async loginUser(loginData: LoginUserDto): Promise<any> {
    const { email, password } = loginData;
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new UnprocessableEntityException('Invalid email or password');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnprocessableEntityException('Invalid email or password');
    }
    const token = await this.signToken(user._id, user.email);
    return {
      token,
      user,
    };
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnprocessableEntityException(
        `User with the email doesn't exist`,
      );
    }

    return user;
  }

  private async signToken(userId: string, email: string): Promise<any> {
    const payload = {
      id: userId,
      email,
    };
    const secret = process.env.JWT_SECRET;
    const token_exp = '1hr';
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: `${token_exp}`,
      secret,
    });
    return token;
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
