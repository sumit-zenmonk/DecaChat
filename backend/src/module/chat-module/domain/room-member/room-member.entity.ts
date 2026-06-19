import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomMemberRole } from "./room-member.enum";

@Entity('room_member')
export class RoomMemberEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "uuid", nullable: false })
    room_uuid: string;

    @Column({ type: "uuid", nullable: false })
    user_uuid: string;

    @Column({
        type: 'enum',
        enum: RoomMemberRole,
        default: RoomMemberRole.USER,
    })
    role: RoomMemberRole;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}