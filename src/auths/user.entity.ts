import { Entity, Column, ObjectIdColumn, ObjectID } from "typeorm";

@Entity("users")
export class User {
    @ObjectIdColumn() id: ObjectID;
    @Column() email: string;
    @Column() name: string;
    @Column() password: string;
    @Column() isManager: boolean;

    constructor(user?: Partial<User>) {
        Object.assign(this, user);
    }
}
