import { Entity, Column, ObjectIdColumn, ObjectID, CreateDateColumn } from "typeorm";

@Entity("teams")
export class Team {
    @ObjectIdColumn()
    id: ObjectID;
    @Column()
    owner: string;
    @Column()
    sharedSignIds: string[];
    @Column()
    name: string;
    @CreateDateColumn()
    createdAt: Date;

    constructor(team?: Partial<Team>) {
        Object.assign(this, team);
    }
}
