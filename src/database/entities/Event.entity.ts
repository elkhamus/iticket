import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { CommonEntity } from "./Common.entity";
import { ImageEntity } from "./Image.entity";
import { Category } from "./Category.entity";
import { Venue } from "./Venue.entity";
import { TicketEntity } from "./Ticket.entity";

@Entity()
export class Event extends CommonEntity {

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    language: string;

    @Column()
    ageReq: number;

    @ManyToOne(() => Venue, (venue) => venue.events)
    @JoinColumn({ name: 'venue_id' })
    venue: Partial<Venue>;

    @ManyToMany(() => Category, (category) => category.events, {onDelete: 'CASCADE'})
    categories: Partial<Category>[];

    @OneToOne(() => ImageEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'image_id' })
    imageId: Partial<ImageEntity>;

    @Column()
    date: Date;

    @OneToMany(() => TicketEntity, (tickets) => tickets.eventId)
    tickets: TicketEntity[];

    @BeforeInsert()
    nameToUpperCase() {
        this.name = this.name.toUpperCase();
    }
}