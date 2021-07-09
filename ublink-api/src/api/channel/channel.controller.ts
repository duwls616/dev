import { Controller, Get } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './entities/channel.entity';

@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {

    }

    @Get('list')
    getChannelList() : Channel[] {
       return this.channelService.getChannelList();
    }
}
