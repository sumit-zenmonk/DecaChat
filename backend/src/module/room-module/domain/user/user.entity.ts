import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomEntity } from "../room/room.entity";
import { RoomMemberEntity } from "../room-member/room-member.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "varchar", nullable: false, unique: true })
    email: string;

    @Column({ type: "varchar", nullable: true })
    name: string;

    @Column({ type: "varchar", nullable: true })
    profile_image: string;

    @Column({ type: "boolean", default: false })
    is_online: boolean;

    @OneToMany(() => RoomMemberEntity, (member) => member.user)
    member: RoomMemberEntity[];

    @OneToMany(() => RoomEntity, (room) => room.creator)
    rooms: RoomEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}