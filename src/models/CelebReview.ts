export interface UpdateCelebReview {
  contents: string;
  postIds:string[];
}

export interface ResponseCelebReview {
  contents: string | null;
  created: string;
  modified: string | null;
}
