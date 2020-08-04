import { ApiProperty } from "@nestjs/swagger";

export class TeamAddResponse {
    constructor({ teamId, name }) {
        this.teamId = teamId;
        this.name = name;
    }

    @ApiProperty({ description: "생성된 팀 ID", type: String })
    teamId: string;

    @ApiProperty({ description: "팀명", type: String })
    name: string;
}
