namespace back.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        public int Likes { get; set; } = 0;
        public string ImagePath { get; set; }
        public Account Creator { get; set; }
        public IList<Commentary> Comments { get; set; } = new List<Commentary>();
        public virtual ICollection<PostUserLike> LikedByUsers { get; set; }
    }
}
