import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomMemberEntity } from "../room-member/room-member.entity";
import { RoomEntity } from "../room/room.entity";

@Entity("chat")
export class RoomChatEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: "uuid" })
    member_uuid: string;

    @Column({ type: "uuid" })
    room_uuid: string;

    @Column({ type: "uuid", nullable: true })
    parent_uuid: string;

    @Column({ type: "text" })
    message: string;

    @ManyToOne(() => RoomEntity, (room) => room.uuid)
    @JoinColumn({ name: "room_uuid" })
    room: RoomEntity;

    @ManyToOne(() => RoomMemberEntity, (member) => member.uuid)
    @JoinColumn({ name: "member_uuid" })
    member: RoomMemberEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}