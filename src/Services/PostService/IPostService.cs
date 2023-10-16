using back.Entities;
using back.Models.Posts;

namespace back.Services.PostService
{
    public interface IPostService
    {
        IEnumerable<PostForAllResponse> GetAll();
        IEnumerable<MyPostResponse> GetMyAll(Account currUser);
        PostForAllResponse GetForAllById(int id);
        MyPostResponse GetMyById(int postId, Account currUser);
        IEnumerable<MyPostResponse> GetChunk(int lastId, Account currUser);
        MyPostResponse Create(CreateRequest model, Account currUser);
        void Like(int id, Account currUser);
        void Dislike(int id, Account currUser);
        CommentResponse Comment(int postId, CommentRequest model, Account currUser);
        IsLikedResponse IsUserLikedPost(int postId, int userId);
        IEnumerable<string> GetStickers();
    }
}
