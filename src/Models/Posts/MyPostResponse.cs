using back.Entities;

namespace back.Models.Posts
{
    public class MyPostResponse
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        public int Likes { get; set; }
        public string Username { get; set; }
        public int UserId { get; set; }
        public string ImagePath { get; set; }
        public IEnumerable<Commentary> Comments { get; set; }
    }
}
