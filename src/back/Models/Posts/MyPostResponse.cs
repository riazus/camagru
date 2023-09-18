using back.Entities;

namespace back.Models.Posts
{
    public class MyPostResponse
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        public int Likes { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImagePath { get; set; }
        public IEnumerable<Commentary> Comments { get; set; }
    }
}
