namespace back.Models.Posts
{
    public class GetCommentsRequest
    {
        public int PostId { get; set; }
        public int? LastCommentId { get; set; }
    }
}
