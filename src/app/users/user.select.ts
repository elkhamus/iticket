import { User } from "src/database/entities/User.entity";
import { FindOptionsSelect } from "typeorm";

export const USER_PROFILE_SELECT: FindOptionsSelect<User> = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    number: true,
    gender: true,
    birthDate: true,
  }