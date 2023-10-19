using back.Data;
using back.Entities;
using back.Models.Posts;
using Microsoft.EntityFrameworkCore;
using static back.Models.Posts.UploadImageRequest;
using System.Text.Json;
using back.Services.Email;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;

namespace back.Services.PostService
{
    public class PostService : IPostService
    {
        private readonly CamagruDbContext _context;
        private static readonly string ImageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Images");
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IEmailService _emailService;

        public PostService(CamagruDbContext context,
            IWebHostEnvironment hostingEnvironment,
            IEmailService emailService)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
            _emailService = emailService;
        }

        public MyPostResponse Create(CreatePostRequest model, Account currUser)
        {
            Post post = new Post
            {
                CreateDate = DateTime.Now,
                Creator = currUser,
                ImagePath = model.FileName,
            };

            _context.Posts.Add(post);
            _context.SaveChanges();

            MyPostResponse response = new MyPostResponse
            {
                Id = post.Id,
                Comments = post.Comments,
                CreateDate = post.CreateDate,
                Username = post.Creator.Username,
                Likes = post.Likes,
                ImagePath = model.FileName,
            };

            return response;
        }

        public void Dislike(int id, Account currUser)
        {
            var post = _context.Posts
                .SingleOrDefault(p => p.Id == id) ?? throw new KeyNotFoundException($"Post with id {id} not found");
            var existingLike = _context.PostUsersLike
                .SingleOrDefault(l => l.PostId == id && l.AccountId == currUser.Id)
                ?? throw new KeyNotFoundException($"Existing like with postId {id} and userId {currUser.Id} not found");

            if (post.Likes > 0)
            {
                post.Likes--;
            }

            _context.PostUsersLike.Remove(existingLike);
            _context.Posts.Update(post);
            _context.SaveChanges();
        }

        public IEnumerable<PostForAllResponse> GetAll()
        {
            var posts = _context.Posts
                .Select(o => new
                {
                    o.ImagePath,
                    o.Creator.Username,
                    o.Likes,
                }).ToList()
                ?? throw new KeyNotFoundException("Posts not found");
            List<PostForAllResponse> response = new List<PostForAllResponse>();

            foreach (var post in posts)
            {
                response.Add(new PostForAllResponse()
                {
                    ImageUrl = post.ImagePath,
                    Username = post.Username,
                    Likes = post.Likes
                });
            }

            return response;
        }

        public PostForAllResponse GetForAllById(int id)
        {
            var post = _context.Posts
                .Where(p => p.Id == id)
                .SingleOrDefault() ?? throw new KeyNotFoundException($"Post with id {id} not found");

            var response = new PostForAllResponse()
            {
                ImageUrl = post.ImagePath,
                Username = post.Creator.Username,
                Likes = post.Likes
            };

            return response;
        }

        public IEnumerable<MyPostResponse> GetMyAll(Account currUser)
        {
            var posts = _context.Posts
                .Where(p => p.Creator.Id == currUser.Id);

            List<MyPostResponse> result = new List<MyPostResponse>();

            foreach (var post in posts)
            {
                result.Add(new MyPostResponse()
                {
                    Id = post.Id,
                    CreateDate = post.CreateDate,
                    Likes = post.Likes,
                    Username = currUser.Username,
                    Comments = post.Comments,
                    ImagePath = post.ImagePath,
                });
            }

            return result;
        }

        public MyPostResponse GetMyById(int id, Account currUser)
        {
            var post = _context.Posts
                .Where(p => p.Creator.Id == currUser.Id && p.Id == id)
                .SingleOrDefault() ?? throw new KeyNotFoundException($"Post with id {id} not found");

            return new MyPostResponse()
            {
                Id = post.Id,
                CreateDate = post.CreateDate,
                Likes = post.Likes,
                Username = currUser.Username,
                Comments = post.Comments,
                ImagePath = post.ImagePath,
            };
        }

        IEnumerable<MyPostResponse> IPostService.GetChunk(int lastId, Account currUser)
        {
            var posts = _context.Posts.FromSqlInterpolated($@"
                    SELECT TOP 5 post.*
                    FROM dbo.Posts post 
                    WHERE post.Id > {lastId} 
                    ORDER BY CreateDate ASC")
                .Include(p => p.Creator)
                .ToList();

            List<MyPostResponse> result = new List<MyPostResponse>();

            foreach (var post in posts)
            {
                result.Add(new MyPostResponse()
                {
                    Id = post.Id,
                    CreateDate = post.CreateDate,
                    Likes = post.Likes,
                    Username = post.Creator.Username,
                    Comments = post.Comments,
                    ImagePath = post.ImagePath,
                });
            }

            return result;
        }

        public void Like(int id, Account currUser)
        {
            var post = _context.Posts
                .SingleOrDefault(p => p.Id == id) ?? throw new KeyNotFoundException($"Post with id {id} not found");

            post.Likes++;

            var postUserLike = new PostUserLike
            {
                Post = post,
                Account = currUser
            };

            _context.PostUsersLike.Add(postUserLike);
            _context.Posts.Update(post);
            _context.SaveChanges();
        }

        public async Task<Tuple<CommentResponse, Account, Commentary>> CreateComment(int postId, CommentRequest model, Account currUser)
        {
            var post = _context.Posts
                .SingleOrDefault(p => p.Id == postId) ?? throw new KeyNotFoundException($"Post with id {postId} not found");

            Commentary commentary = new()
            {
                Content = model.Commentary,
                CreatedDate = DateTime.Now,
                Post = post,
                Account = currUser
            };

            _context.Comments.Add(commentary);
            _context.SaveChanges();

            CommentResponse response = new()
            {
                CommentId = commentary.Id,
                Comment = commentary.Content,
                CreateDate = commentary.CreatedDate,
                Username = currUser.Username,
            };

            var tuple = new Tuple<CommentResponse, Account, Commentary>(response, commentary.Post.Creator, commentary);

            return tuple;
        }

        public IsLikedResponse IsUserLikedPost(int postId, int userId)
        {
            var postUserLike = _context.PostUsersLike
                .SingleOrDefault(l => l.AccountId == userId && l.PostId == postId);

            var isLikedResponse = new IsLikedResponse { IsLiked = true };

            if (postUserLike == null)
            {
                isLikedResponse.IsLiked = false;
            }

            return isLikedResponse;
        }

        public IEnumerable<string> GetStickers()
        {
            string stickersFolderPath = Path.Combine(_hostingEnvironment.ContentRootPath, "wwwroot", "media", "stickers");
            string[] stickerPaths = Directory.GetFiles(stickersFolderPath);

            IEnumerable<string> fileNames = stickerPaths.Select(filePath => Path.GetFileName(filePath));

            return fileNames;
        }


        public byte[] CreateAndSendImage(UploadImageRequest request)
        {
            return GetUserBitmapImage(request);
        }

        public string UploadImageForUser(UploadImageRequest request)
        {
            return GetUserBitmapImage2(request);
        }

        public byte[] GetUserBitmapImage(UploadImageRequest request)
        {
            byte[] baseImageBytes = Convert.FromBase64String(request.BaseImage);
            request.Stickers = JsonSerializer.Deserialize<StickerInformation[]>(request.StickerArray);

            using (MemoryStream baseImageStream = new MemoryStream(baseImageBytes))
            using (Image image = Image.Load(baseImageStream))
            {
                int baseNewHeight = request.Height;
                int baseNewWidth = (int)(image.Width * ((double)baseNewHeight / image.Height));
                image.Mutate(x => x.Resize(new ResizeOptions { Size = new Size(baseNewWidth, baseNewHeight) }));

                if (request.Stickers != null)
                {
                    foreach (var sticker in request.Stickers)
                    {
                        byte[] stickerImageBytes = Convert.FromBase64String(sticker.image);

                        using (MemoryStream stickerImageStream = new MemoryStream(stickerImageBytes))
                        using (Image stickerImage = Image.Load(stickerImageStream))
                        {
                            stickerImage.Mutate(x => x.Resize(new ResizeOptions { Size = new Size(sticker.width, sticker.height) }));
                            image.Mutate(x => x.DrawImage(stickerImage, new Point(sticker.x, sticker.y), 1f));
                        }
                    }
                }

                using (MemoryStream outputStream = new MemoryStream())
                {
                    image.Save(outputStream, new PngEncoder());
                    return outputStream.ToArray();
                }
            }
        }

        public string GetUserBitmapImage2(UploadImageRequest request)
        {
            byte[] baseImageBytes = Convert.FromBase64String(request.BaseImage);
            request.Stickers = JsonSerializer.Deserialize<StickerInformation[]>(request.StickerArray);

            using (MemoryStream baseImageStream = new MemoryStream(baseImageBytes))
            using (Image image = Image.Load(baseImageStream))
            {
                int baseNewWidth = (int)(image.Width * ((double)request.Height / image.Height));
                image.Mutate(x => x.Resize(new ResizeOptions { Size = new Size(baseNewWidth, request.Height) }));

                if (request.Stickers != null)
                {
                    foreach (var sticker in request.Stickers)
                    {
                        byte[] stickerImageBytes = Convert.FromBase64String(sticker.image);
                        using (MemoryStream stickerImageStream = new MemoryStream(stickerImageBytes))
                        using (Image stickerImage = Image.Load(stickerImageStream))
                        {
                            stickerImage.Mutate(x => x.Resize(new ResizeOptions { Size = new Size(sticker.width, sticker.height) }));
                            image.Mutate(x => x.DrawImage(stickerImage, new Point(sticker.x, sticker.y), 1f));
                        }
                    }
                }

                string fileName = $"{Guid.NewGuid()}_{request.UserId}.png";
                string filePath = Path.Combine(ImageDirectory, fileName);

                if (!Directory.Exists(ImageDirectory))
                {
                    Directory.CreateDirectory(ImageDirectory);
                }

                image.Save(filePath);

                return fileName;
            }
        }

        public IEnumerable<GetCommentsResponse> GetComments(GetCommentsRequest getCommentsRequest)
        {
            var comments = _context.Comments.FromSqlInterpolated($@"
                    SELECT TOP 3 comment.*
                    FROM dbo.Comments comment
                    WHERE comment.Id < {getCommentsRequest.LastCommentId} AND comment.PostId = {getCommentsRequest.PostId}
                    ORDER BY comment.Id DESC")
                .Include(c => c.Account)
                .ToList();

            List<GetCommentsResponse> res = new List<GetCommentsResponse>();

            foreach(Commentary comment in comments)
            {
                res.Add(new GetCommentsResponse
                {
                    Id = comment.Id,
                    Comment = comment.Content,
                    Username = comment.Account.Username,
                    CreatedDate = comment.CreatedDate,
                });
            }

            return res;
        }

        public int GetPostCommentsCount(int postId)
        {
            return _context.Comments.Where(c => c.Post.Id == postId).Count();
        }

        public async Task SendCommentEmail(Account postCreator, Commentary comment)
        {
            var message = @$"<p>Hi, {postCreator.Username}!</p>
                <p>One of your posts just got a new comment from {comment.Account.Username}.</p>
                <p>--> {comment.Account.Username}: {comment.Content}</p>
                <p>Thanks,</p>
                <p>Camagru</p>";

            await _emailService.SendAsync(
            to: postCreator.Email,
            subject: "Camagru - New Comment On Your Post",
            html: $@"<h4>New Comment</h4>
                        {message}"
            );
        }
    }
}
