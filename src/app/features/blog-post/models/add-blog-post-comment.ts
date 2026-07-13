export interface AddBlogPostComment {
  blogPostId: string;
  userId: string;
  description: string;
  parentCommentId?: string | null;
}
