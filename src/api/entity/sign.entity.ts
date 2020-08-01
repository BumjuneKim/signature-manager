import { Entity, Column, ObjectIdColumn, ObjectID, CreateDateColumn } from "typeorm";

export enum SignStatus {
    ACTIVE = "ACTIVE",
    DELETED = "DELETED",
}

@Entity("signs")
export class Sign {
    @ObjectIdColumn()
    id: ObjectID;
    @Column()
    owner: string;
    @Column()
    signImageUrl: string;
    @Column({ enum: Object.keys(SignStatus) })
    status: string;
    @CreateDateColumn()
    createdAt: Date;

    constructor(sign?: Partial<Sign>) {
        Object.assign(this, sign);
    }
}
