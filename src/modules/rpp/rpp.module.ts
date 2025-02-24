import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { rppService } from "./rpp.service";
import { rppResolver } from "./rpp.resolver";

@Module({
    imports: [CommonModule],
    providers: [rppResolver, rppService],
    exports: [rppService]
})

export class rppModule {}