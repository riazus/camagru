namespace back.Entities
{
    public class Commentary
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; }
        public Account Account { get; set; }
        public Post Post { get; set; }
    }
}
