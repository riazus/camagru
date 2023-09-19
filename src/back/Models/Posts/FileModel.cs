using System.ComponentModel.DataAnnotations;

namespace back.Models.Posts
{
    public class FileModel
    {
        [Required]
        public string FileName { get; set; }
        [Required]
        public IFormFile File { get; set; }
    }
}
