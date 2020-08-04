import { ApiProperty } from "@nestjs/swagger";

export class LoginUserResponse {
    constructor({ id, isManager }) {
        this.id = id;
        this.isManager = isManager;
    }

    @ApiProperty({ description: "유저 ID" })
    id: string;

    @ApiProperty({ description: "팀장/팀원 여부" })
    isManager: boolean;
}
