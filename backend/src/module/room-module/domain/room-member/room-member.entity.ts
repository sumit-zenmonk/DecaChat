import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomEntity } from "../room/room.entity";
import { UserEntity } from "../user/user.entity";
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

    @ManyToOne(() => RoomEntity, (room) => room.members, { eager: true })
    @JoinColumn({ name: "room_uuid" })
    room: RoomEntity;

    @ManyToOne(() => UserEntity, (user) => user.member)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}