import { DataSource } from "typeorm";
import { User } from "../entities/User.entity";
import { UserGender, UserRole } from "src/shared/enum/user.enum";

export async function defaultAdmin(DataSource: DataSource) {
    let adminRepo = DataSource.getRepository(User);

    let defaultAdmin = await adminRepo.create({
        firstName: "Admin",
        lastName: "",
        email: "admin@example.com", 
        password: "123qwerty",
        birthDate: new Date("2005-01-01"),
        number: "123-456-78-90",
        gender: UserGender.MALE,               
        roles: [ UserRole.ADMIN ]               
    })    

    await defaultAdmin.save();    
}