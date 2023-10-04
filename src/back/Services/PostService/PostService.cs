using back.Data;
using back.Entities;
using back.Models.Posts;

namespace back.Services.PostService
{
    public class PostService : IPostService
    {
        private readonly CamagruDbContext _context;
        private static readonly string ImageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Images");

        public PostService(CamagruDbContext context) 
        {
            _context = context;
        }

        public MyPostResponse Create(CreateRequest model, Account currUser)
        {
            // Ensure the Images directory exists (create it if it doesn't)
            if (!Directory.Exists(ImageDirectory))
            {
                Directory.CreateDirectory(ImageDirectory);
            }

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + model.FileName;
            string imagePath = Path.Combine(ImageDirectory, uniqueFileName);

            using (Stream stream = new FileStream(imagePath, FileMode.Create))
            {
                model.File.CopyTo(stream);
            }

            Post post = new Post
            {
                CreateDate = DateTime.Now,
                Account = currUser,
                ImagePath = uniqueFileName,
            };

            _context.Posts.Add(post);
            _context.SaveChanges();

            MyPostResponse response = new MyPostResponse
            {
                Id = post.Id,
                Comments = post.Comments,
                CreateDate = post.CreateDate,
                Username = post.Account.Username,
                Likes = post.Likes,
                ImagePath = uniqueFileName,
            };

            return response;
        }

        public void Dislike(int id)
        {
            var post = _context.Posts
                .FirstOrDefault(p => p.Id == id) ?? throw new KeyNotFoundException($"Post with id {id} not found");

            if (post.Likes > 0)
            {
                post.Likes--;
            }

            _context.Update(post);
            _context.SaveChanges();
        }

        public IEnumerable<PostForAllResponse> GetAll()
        {
            var posts = _context.Posts;
            List<PostForAllResponse> response = new List<PostForAllResponse>();

            foreach(var post in posts)
            {
                response.Add(new PostForAllResponse()
                {
                    ImageUrl = post.ImagePath,
                    Username = post.Account.Username,
                    Likes = post.Likes
                });
            }

            return response;
        }

        public PostForAllResponse GetForAllById(int id)
        {
            var post = _context.Posts
                .Where(p => p.Id == id)
                .FirstOrDefault() ?? throw new KeyNotFoundException($"Post with id {id} not found");

            var response = new PostForAllResponse()
            {
                ImageUrl = post.ImagePath,
                Username = post.Account.Username,
                Likes = post.Likes
            };

            return response;
        }

        public IEnumerable<MyPostResponse> GetMyAll(Account currUser)
        {
            var posts = _context.Posts
                .Where(p => p.Account.Id == currUser.Id);
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
                .Where(p => p.Account.Id == currUser.Id && p.Id == id)
                .FirstOrDefault() ?? throw new KeyNotFoundException($"Post with id {id} not found");

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

        public void Like(int id)
        {
            var post = _context.Posts
                .FirstOrDefault(p => p.Id == id) ?? throw new KeyNotFoundException($"Post with id {id} not found");

            post.Likes++;

            _context.Update(post);
            _context.SaveChanges();
        }

        public CommentResponse Comment(int postId, CommentRequest model, Account currUser)
        {
            var post = _context.Posts
                .FirstOrDefault(p => p.Id == postId) ?? throw new KeyNotFoundException($"Post with id {postId} not found");

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
    }
}
