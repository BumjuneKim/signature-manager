import { ApiProperty } from "@nestjs/swagger";

export class SignAddResponse {
    constructor({ signId, signImageUrl }) {
        this.signId = signId;
        this.signImageUrl = signImageUrl;
    }

    @ApiProperty({ description: "생성된 서명의 ID", type: String })
    signId: string;

    @ApiProperty({ description: "생성된 서명 이미지 URL ", type: String })
    signImageUrl: string;
}
