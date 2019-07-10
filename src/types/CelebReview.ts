export interface UpdateCelebReview {
  contents: string;
  instagramUrl: string;
}

export interface ResponseCelebReview {
  contents: string | null;
  instagramUrl: string | null;
  created: string;
  modified: string | null;
}
