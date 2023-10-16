using back.Data;
using back.Entities;
using back.Models.Posts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting.Internal;

namespace back.Services.PostService
{
    public class PostService : IPostService
    {
        private readonly CamagruDbContext _context;
        private static readonly string ImageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Images");
        private readonly IWebHostEnvironment _hostingEnvironment;

        public PostService(CamagruDbContext context, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        public MyPostResponse Create(CreateRequest model, Account currUser)
        {
            // Ensure the Images directory exists (create it if it doesn't)
            if (!Directory.Exists(ImageDirectory))
            {
                Directory.CreateDirectory(ImageDirectory);
            }

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + model.File.FileName;
            string imagePath = Path.Combine(ImageDirectory, uniqueFileName);

            using (Stream stream = new FileStream(imagePath, FileMode.Create))
            {
                model.File.CopyTo(stream);
            }

            Post post = new Post
            {
                CreateDate = DateTime.Now,
                Creator = currUser,
                ImagePath = uniqueFileName,
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
                ImagePath = uniqueFileName,
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

            foreach(var post in posts)
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

        public CommentResponse Comment(int postId, CommentRequest model, Account currUser)
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

            CommentResponse response = new()
            {
                Comment = commentary.Content,
                CreateDate = commentary.CreatedDate,
                Username = currUser.Username,
            };

            return response;
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
    }
}
