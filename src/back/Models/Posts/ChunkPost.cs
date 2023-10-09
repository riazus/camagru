namespace back.Models.Posts
{
    public class ChunkPost
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        public int Likes { get; set; }
        public string ImagePath { get; set; }
        public string Username { get; set; }
    }
}
