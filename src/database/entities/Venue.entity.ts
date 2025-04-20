import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";
import { CommonEntity } from "./Common.entity";
import { Event } from "./Event.entity";

@Entity()
export class Venue extends CommonEntity {

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Event, (events) => events.venue)
    events: Event[];

    @BeforeInsert()
    nameToUpperCase() {
        this.name = this.name.toUpperCase();
    }

}