import { ApiProperty } from "@nestjs/swagger";

export class SignupResponse {
    constructor() {
        this.success = true;
    }

    @ApiProperty({ description: "회원가입 성공 여부", type: Boolean })
    success: boolean;
}
