export interface BlogComment {
  id: string;
  description: string;
  dateAdded: Date;
  userName: string;
  parentCommentId?: string | null;
  replyCount: number;
  replies: BlogComment[];
  isDeleted: boolean;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  canDelete: boolean;
  isLikeLoading?: boolean;
  isDeleteLoading?: boolean;
}
