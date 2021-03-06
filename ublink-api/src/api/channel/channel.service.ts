import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'common/entities/channel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>
    ) {
        this.channelRepository = channelRepository;
    }

    getList(): Promise<Channel[]>{
        return this.channelRepository.find();
    }

}
