import { Entity, Column, ObjectIdColumn, ObjectID, CreateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

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

    @ApiProperty()
    @Column()
    email: string;

    @ApiProperty()
    @Column()
    name: string;

    @Column()
    password: string;

    @ApiProperty()
    @Column()
    isManager: boolean;

    @ApiProperty()
    @Column()
    belongingTeams: IBelongingTeam[];

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    constructor(user?: Partial<User>) {
        Object.assign(this, user);
    }
}
