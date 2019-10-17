import { FileObject } from './FileObject';
import { ResponseExperienceGroupConsumer } from './Consumer';
import { PrizeStatus } from 'enums';

export interface ResponseClientExperienceGroupConsumer {
  experienceGroupConsumerId: number;
  experienceGroupReviewCreated: string;
  contents: string;
  starRate: number;
  images: FileObject[];
  consumer: ResponseExperienceGroupConsumer;
}

export interface ResponseSearchExperienceGroupConsumers {
  experienceGroupConsumerId: number;
  created: string;
  consumer: ResponseExperienceGroupConsumer;
  prizeStatus: PrizeStatus;
  experienceGroupReviewCreated: string;
  expose: boolean;
}

export interface ResponseExperienceGroupConsumers {
  experienceGroupConsumerId: number;
  experienceGroupReviewCreated: string;
  consumer: ResponseExperienceGroupConsumer;
  starRate: number;
  contents: string;
  images: FileObject[];
}

export interface SearchExperienceGroupConsumer {
  username: string;
  phone: string;
  createdStarted: string;
  createdEnded: string;
  prizeStatuses: PrizeStatus[];
}

export interface UpdateExperienceGroupConsumersPrize {
  experienceGroupConsumerIds: number[];
  prizeStatus: PrizeStatus;
}

export interface UpdateExperienceGroupConsumerExpose {
  expose: boolean;
}
