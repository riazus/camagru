using back.Entities;
using System.ComponentModel.DataAnnotations;

namespace back.Models.Posts
{
    public class CreatePostRequest
    {
        [Required]
        public string FileName { get; set; }
    }
}
