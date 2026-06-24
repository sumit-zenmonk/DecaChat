import { AfterLoad, Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { RoomMemberEntity } from "../room-member/room-member.entity";

@Entity('room')
export class RoomEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "varchar", nullable: false, })
    name: string;

    @Column({ type: "varchar", nullable: true })
    description: string;

    @Column({ type: "uuid", nullable: false })
    creator_uuid: string;

    @ManyToOne(() => UserEntity, (user) => user.rooms)
    @JoinColumn({ name: "creator_uuid" })
    creator: UserEntity;

    @OneToMany(() => RoomMemberEntity, (member) => member.room)
    members: RoomMemberEntity[];

    @AfterLoad()
    countPhotos() {
        if (this.members) {
            this.membersCount = this.members.length;
        } else {
            this.membersCount = 0;
        }
    }
    membersCount: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}