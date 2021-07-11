import { Controller, Get, Post, Query } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from 'common/entities/channel.entity';

@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {

    }

    @Get('list')
    getList(@Query("name") channelName : string) : Promise<Channel[]> {
       return this.channelService.getList();
    }
}
