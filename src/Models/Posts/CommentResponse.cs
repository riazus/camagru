using System.ComponentModel.DataAnnotations;

namespace back.Models.Posts
{
    public class CommentResponse
    {
        [Required]
        public string Comment { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public DateTime CreateDate { get; set; }
    }
}
