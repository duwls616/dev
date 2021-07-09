import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index(['channelId'])
export class Channel {
    @PrimaryGeneratedColumn()
    channelId: string;

    @Column({ length: 40, unique: false})
    name: string;
}
