namespace back.Models.Posts
{
    public class UploadImageRequest
    {
        public int? UserId { get; set; }
        public string BaseImage { get; set; }
        public int Height { get; set; }
        public string StickerArray { get; set; }
        public IEnumerable<StickerInformation> Stickers { get; set; }

        public class StickerInformation
        {
            public string image { get; set; }
            public int x { get; set; }
            public int y { get; set; }
            public int width { get; set; }
            public int height { get; set; }
        }
    }
}
