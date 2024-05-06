import bcrypt from 'bcrypt';

import { CreateUserRequest, CreateUserResponse, LoginUserRequest, LoginUserResponse } from "../models/user-model";
import { UserRepository } from '../repositories/user-repository';
import { generateJwtToken } from '../utils/util';

export class UserService {
    private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async register(createUserRequest: CreateUserRequest): Promise<CreateUserResponse> {
    const hashed = await bcrypt.hash(createUserRequest.password, 10)
    const createdUserId = await this.userRepository.create({
        id: 0,
        email: createUserRequest.email,
        password: hashed,
        name: createUserRequest.name,
    })

    const generatedToken = await generateJwtToken(createdUserId);

    return {
        id: createdUserId,
        token: generatedToken
    }
  }

  async login(loginUserRequest: LoginUserRequest): Promise<LoginUserResponse> {
    const user = await this.userRepository.getByEmail(loginUserRequest.email);
    const isPasswordMatched = await bcrypt.compare(loginUserRequest.password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Invalid Password")
    }

    const generatedToken = await generateJwtToken(user.id);

    return {
        token: generatedToken
    }
  }
}