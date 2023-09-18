namespace back.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        public int Likes { get; set; } = 0;
        public string ImagePath { get; set; }
        public Account Account { get; set; }
        public List<Commentary> Comments { get; set; }
    }
}
