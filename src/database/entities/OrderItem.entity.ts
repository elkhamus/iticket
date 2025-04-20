import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CommonEntity } from "./Common.entity";
import { TicketEntity } from "./Ticket.entity";

@Entity()
export class OrderItem extends CommonEntity{
    @Column('float')
    price: number;

    @OneToOne(() => TicketEntity, { cascade: true })
    @JoinColumn()
    ticket: TicketEntity;

    @Column()
    ticketId: number;
}