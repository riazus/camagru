using System.ComponentModel.DataAnnotations;

namespace back.Models.Posts
{
    public class CommentRequest
    {
        [Required]
        public string Commentary { get; set; }
    }
}
