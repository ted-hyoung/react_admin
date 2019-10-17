import { CreateFileObject, FileObject, UpdateFileObject } from './FileObject';
import { ExperienceGroupStatus } from 'enums/ExperienceGroupStatus';
import { ResponseClientExperienceGroupConsumer } from './ExpGroupConsumer';
import { CreateConsumerForExperienceGroupConsumerUpload } from './Consumer';

export interface CreateExperienceGroup {
  experienceGroupName: string;
  images: CreateFileObject[];
  recruitmentStarted: string;
  recruitmentEnded: string;
  title: string;
  recruitmentPersonnelCount: number;
  benefit: string;
  prizeDate: string;
  shippingStarted: string;
  reviewDeadline: string;
  detail: string;
  experienceGroupNoticeImages: CreateFileObject[];
}

export interface UpdateExperienceGroup {
  experienceGroupName: string;
  images: UpdateFileObject[];
  recruitmentStarted: string;
  recruitmentEnded: string;
  title: string;
  recruitmentPersonnelCount: number;
  benefit: string;
  prizeDate: string;
  shippingStarted: string;
  reviewDeadline: string;
  detail: string;
  experienceGroupNoticeImages: UpdateFileObject[];
}

export interface ResponseExperienceGroups {
  experienceGroupId: number;
  experienceGroupName: string;
  recruitmentStarted: string;
  recruitmentEnded: string;
  recruitmentPersonnelCount: number;
  experienceGroupStatus: ExperienceGroupStatus;
  totalRecruitmentPersonnelCount: number;
}

export interface ResponseExperienceGroup {
  experienceGroupId: number;
  experienceGroupName: string;
  recruitmentStarted: string;
  recruitmentEnded: string;
  experienceGroupStatus: ExperienceGroupStatus;
  totalRecruitmentPersonnelCount: number;
  images: FileObject[];
  experienceGroupNoticeImages: FileObject[];
  title: string;
  recruitmentPersonnelCount: number;
  benefit: string;
  prizeDate: string;
  shippingStarted: string;
  reviewDeadline: string;
  detail: string;
  experienceGroupConsumers: ResponseClientExperienceGroupConsumer[];
}

export interface UpdateExperienceGroupConsumerUpload {
  consumers: CreateConsumerForExperienceGroupConsumerUpload[];
}
