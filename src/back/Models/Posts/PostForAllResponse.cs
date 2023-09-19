using System.ComponentModel.DataAnnotations;

namespace back.Models.Posts
{
    public class PostForAllResponse
    {
        [Required]
        public string ImageUrl { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public int Likes { get; set; }
    }
}
