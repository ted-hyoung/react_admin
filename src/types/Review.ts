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
  };
  // images: CommonFile[];
  // todo : order
  order?: object;
  sequence?: number;
}

export interface UpdateReview {
  starRate: number;
  contents: string;
  expose?: boolean;
  // images?: CommonFile[];
}

export interface SearchReview {
  expose?: boolean;
  startDate?: Date;
  endDate?: Date;
  creatorLoginId?: string;
  creatorPhone?: string;
  eventName?: string;
  productName?: string;
  orderId?: number;
  contents?: string;
  isBest?: boolean;
}
