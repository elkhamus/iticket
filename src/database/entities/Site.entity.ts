import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { CommonEntity } from "./Common.entity";
import { ImageEntity } from "./Image.entity";

@Entity()
export class SiteEntity extends CommonEntity {

    @Column()
    name: string;

    @Column()
    lightMode: Boolean;

    @Column()
    aboutUs: string;

    @Column()
    contactUs: string;

    @Column()
    icon: string;
    
}