import { Entity, Column, ObjectIdColumn, ObjectID, CreateDateColumn } from "typeorm";

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
    @CreateDateColumn()
    createdAt: Date;

    constructor(user?: Partial<User>) {
        Object.assign(this, user);
    }
}
