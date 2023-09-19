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
        MyPostResponse Create(CreateRequest model, Account currUser);
        void Like(int id);
        void Dislike(int id);
        CommentResponse Comment(int postId, CommentRequest model, Account currUser);
    }
}
