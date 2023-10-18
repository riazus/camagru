using back.Authorization;
using back.Models.Posts;
using back.Services.PostService;
using Microsoft.AspNetCore.Mvc;

namespace back.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PostsController : BaseController
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        [AllowAnonymous]
        [HttpGet("all")]
        public ActionResult<IEnumerable<PostForAllResponse>> GetAll()
        {
            var posts = _postService.GetAll();
            return Ok(posts);
        }

        [AllowAnonymous]
        [HttpGet("all/{id:int}")]
        public ActionResult<PostForAllResponse> GetForAllById(int id)
        {
            var post = _postService.GetForAllById(id);
            return Ok(post);
        }

        [HttpGet]
        public ActionResult<IEnumerable<MyPostResponse>> GetMyAll()
        {
            var posts = _postService.GetMyAll(Account);
            return Ok(posts);
        }

        [HttpGet("{id:int}")]
        public ActionResult<MyPostResponse> GetMyById(int id)
        {
            var post = _postService.GetMyById(id, Account);
            return Ok(post);
        }

        [AllowAnonymous]
        [HttpGet("by-chunk/{lastId:int}")]
        public ActionResult<MyPostResponse> GetChunk(int lastId)
        {
            var posts = _postService.GetChunk(lastId, Account);
            return Ok(posts);
        }

        [HttpPost]
        public ActionResult<MyPostResponse> Create(CreatePostRequest model)
        {
            var post = _postService.Create(model, Account);
            return Ok(post);
        }

        [HttpPut("like/{id:int}")]
        public ActionResult Like(int id)
        {
            _postService.Like(id, Account);
            return Ok();
        }

        [HttpPut("dislike/{id:int}")]
        public ActionResult Dislike(int id)
        {
            _postService.Dislike(id, Account);
            return Ok();
        }

        [HttpPost("comment/{id:int}")]
        public async Task<ActionResult<CommentResponse>> CreateComment(int id, CommentRequest model)
        {
            var response = await _postService.CreateComment(id, model, Account);
            
            _ = Task.Run(async () =>
            {
                await _postService.SendCommentEmail(response.Item2, response.Item3);
            });

            return Ok(response.Item1);
        }

        [HttpGet("is-liked/{postId:int}")]
        public ActionResult<IsLikedResponse> IsLiked(int postId)
        {
            var response = _postService.IsUserLikedPost(postId, Account.Id);
            return Ok(response);
        }

        [HttpGet("stickers")]
        public ActionResult<IEnumerable<string>> Stickers()
        {
            var response = _postService.GetStickers();
            return Ok(response);
        }

        [HttpPost("image-upload")]
        public ActionResult UploadImage(UploadImageRequest request)
        {
            if (request.UserId != null)
            {
                var fileName = _postService.UploadImageForUser(request);
                return Ok(new { fileName });
            }
            else
            {
                var userImageBytes = _postService.CreateAndSendImage(request);
                return File(userImageBytes.ToArray(), "image/png");
            }
        }

        [AllowAnonymous]
        [HttpPost("comment")]
        public ActionResult GetComments(GetCommentsRequest getCommentsRequest)
        {
            var response = _postService.GetComments(getCommentsRequest);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("comment/count/{postId:int}")]
        public ActionResult GetPostCommentsCount(int postId)
        {
            var commentsCount = _postService.GetPostCommentsCount(postId); 
            return Ok(new { commentsCount });
        }
    }
}
