import { ApiProperty } from "@nestjs/swagger";

export class SimpleSuccessResponse {
    constructor() {
        this.success = true;
    }

    @ApiProperty({ description: "API 호출 성공", type: Boolean })
    success: boolean;
}
