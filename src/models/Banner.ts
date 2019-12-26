
import { CreateFileObject, FileObject } from './FileObject';
import { BannerExposeStatus, BannerType, BannerOrder } from 'enums/Banner';

export interface ResponseBannerList
{
  bannerId:number;
  mainEnable:boolean;
  created:string;
  exposeStarted:string;
  exposeEnded:string;
  bannerType:BannerType;
  bannerExposeStatus:BannerExposeStatus;
  title:string;
  url:string;
  viewCnt:number;
  image: FileObject;
}


export interface SearchBannerList
{
  bannerOrder?:BannerOrder;
  bannerType?:BannerType;
  bannerExposeStatus?:BannerExposeStatus;
  title?:string;
}

export interface SearchAccount
{
  searchText:string;
}

export interface CreateBanner
{
  exposeStarted: string;
  exposeEnded: string;
  bannerType: BannerType;
  periodEnable: boolean;
  title:string;
  url:string;
  videoUrl?: string;
  image: CreateFileObject;
  eventId:number;
}

export interface UpdateBanner
{
  exposeMain: boolean,
  bannerIds: number[] | string []
}

export interface SelectedBanner
{
  bannerIds: number[] | string []
}
