import { Entity, Column, ObjectIdColumn, ObjectID, CreateDateColumn } from "typeorm";

export enum TeamCrewAuthority {
    READ_ONLY = "READ_ONLY",
    WRITE_READ = "WRITE_READ",
}

export interface IBelongingTeam {
    teamId: string;
    authority: TeamCrewAuthority;
}

@Entity("users")
export class User {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    isManager: boolean;

    @Column()
    belongingTeams: IBelongingTeam[];

    @CreateDateColumn()
    createdAt: Date;

    constructor(user?: Partial<User>) {
        Object.assign(this, user);
    }
}
