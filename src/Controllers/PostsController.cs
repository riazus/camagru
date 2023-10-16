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
        public ActionResult<MyPostResponse> Create([FromForm] CreateRequest model)
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
        public ActionResult<CommentResponse> Comment(int id, CommentRequest model)
        {
            var response = _postService.Comment(id, model, Account);
            return Ok(response);
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
    }
}
