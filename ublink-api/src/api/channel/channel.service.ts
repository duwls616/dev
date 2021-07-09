import { Injectable } from '@nestjs/common';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
    private channel: Channel[] = [];

    getChannelList(): Channel[]{
        const channel = [{

        }];
    }

}
