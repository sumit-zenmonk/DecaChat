import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('room')
export class RoomEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "uuid", nullable: false })
    creator_uuid: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}