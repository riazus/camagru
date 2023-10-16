using back.Entities;
using System.ComponentModel.DataAnnotations;

namespace back.Models.Posts
{
    public class CreateRequest
    {
        [Required]
        public IFormFile File { get; set; }
    }
}
