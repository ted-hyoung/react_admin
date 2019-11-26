
import { FileObject } from "./FileObject";
import { BannerExposeStatus, BannerType, BannerOrder } from 'enums/Banner';

export interface ResponseBannerList
{
  bannerId:number;
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
  bannerOrder:BannerOrder;
  bannerType:BannerType;
  bannerExposeStatus:BannerExposeStatus;
  title:string;
}