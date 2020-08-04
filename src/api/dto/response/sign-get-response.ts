import { ApiProperty } from "@nestjs/swagger";

export class SignGetResponse {
    constructor({ signId, signImageUrl, createdAt }) {
        this.signId = signId;
        this.signImageUrl = signImageUrl;
        this.createdAt = createdAt;
    }

    @ApiProperty({ description: "생성된 서명의 ID", type: String })
    signId: string;

    @ApiProperty({ description: "생성된 서명 이미지 URL ", type: String })
    signImageUrl: string;

    @ApiProperty({ description: "서명 생성 날짜", type: Date })
    createdAt: Date;
}
