import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'CHANNEL' })
export class Channel {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 40, unique: false})
    name: string;

    @Column({ length: 40, unique: false})
    ch_id: string;

    @Column({ length: 40, unique: false})
    b_num: string;

    @Column({ length: 40, unique: false})
    b_name: string;

    @Column({ length: 40, unique: false})
    address: string;

    @Column({ length: 40, unique: false})
    fax: string;

    @Column({ length: 40, unique: false})
    tel: string;

    @Column({ length: 40, unique: false})
    sta_cd: string;

    @Column({ length: 40, unique: false})
    sta_time: string;

    @Column({ length: 40, unique: false})
    sta_user: string;
}