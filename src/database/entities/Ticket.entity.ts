import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CommonEntity } from "./Common.entity";
import { Event } from "./Event.entity";
import { TicketStatus } from "src/shared/enum/ticket.enum";
import { User } from "./User.entity";
import { OrderItem } from "./OrderItem.entity";

@Entity()
export class TicketEntity extends CommonEntity {

    @Column({ type: 'float' })
    price: number;

    @Column()
    seat: number;

    @Column({
        type: 'enum',
        enum: TicketStatus
    })
    status: TicketStatus;

    @ManyToOne(() => User, (user) => user.tickets)
    @JoinColumn({ name: 'user_id' })
    user: Partial<User>;
    
    @ManyToOne(() => Event, (event) => event.tickets)
    @JoinColumn({ name: 'event_id' })
    eventId: Partial<Event>;

    @OneToOne(() => OrderItem, { cascade: true })
    orderItem: OrderItem;
    
}