export interface CreateReview {
  starRate: number;
  contents: string;
  // images?: CommonFile[];
  // todo : order, orderItem?
}

export interface ResponseReview {
  reviewId: number;
  starRate: number;
  contents: string;
  created: Date;
  creator: {
    username: string;
    phone: string;
  };
  sequence: number;
  expose: boolean;
  order?: object;
  images?: object[];
}

export interface UpdateReview {
  sequence: boolean;
}

export interface SearchReview {
  startDate?: Date;
  endDate?: Date;
  creatorLoginId?: string;
  creatorPhone?: string;
  eventName?: string;
  productName?: string;
  orderId?: number;
  contents?: string;
}
