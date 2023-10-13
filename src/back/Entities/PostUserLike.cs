namespace back.Entities
{
    public class PostUserLike
    {
        public int Id { get; set; }

        public int AccountId { get; set; }
        public virtual Account Account { get; set; }

        public int PostId { get; set; }
        public virtual Post Post { get; set; }
    }
}
