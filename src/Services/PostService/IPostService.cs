using back.Entities;
using back.Models.Posts;
using Microsoft.AspNetCore.Mvc;

namespace back.Services.PostService
{
    public interface IPostService
    {
        IEnumerable<PostForAllResponse> GetAll();
        IEnumerable<MyPostResponse> GetMyAll(Account currUser);
        PostForAllResponse GetForAllById(int id);
        MyPostResponse GetMyById(int postId, Account currUser);
        IEnumerable<MyPostResponse> GetChunk(int lastId, Account currUser);
        MyPostResponse Create(CreatePostRequest model, Account currUser);
        void Like(int id, Account currUser);
        void Dislike(int id, Account currUser);
        Task<Tuple<CommentResponse, Account, Commentary>> CreateComment(int postId, CommentRequest model, Account currUser);
        //Task<IActionResult> CreateComment(int postId, CommentRequest model, Account currUser);
        IsLikedResponse IsUserLikedPost(int postId, int userId);
        IEnumerable<string> GetStickers();
        byte[] CreateAndSendImage(UploadImageRequest request);
        string UploadImageForUser(UploadImageRequest request);
        IEnumerable<GetCommentsResponse> GetComments(GetCommentsRequest getCommentsRequest);
        int GetPostCommentsCount(int postId);
        Task SendCommentEmail(Account postCreator, Commentary comment);
    }
}
