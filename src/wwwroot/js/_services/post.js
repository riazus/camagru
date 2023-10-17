import { fetchWrapper } from "../_api/fetch-wrapper.js";

const baseUrl = `/posts`;

export const postService = {
  getChunkPosts,
  isUserLikedPost,
  like,
  dislike,
  getStickersName,
  uploadImage,
  uploadImageForUser,
  createNewPost,
  createCommentary,
  getComments,
  getPostCommentsCount
};

function getChunkPosts(postId) {
  return fetchWrapper.get(`${baseUrl}/by-chunk/${postId ?? 0}`);
}

function isUserLikedPost(postId) {
  return fetchWrapper.get(`${baseUrl}/is-liked/${postId}`);
}

function like(postId) {
  return fetchWrapper.put(`${baseUrl}/like/${postId}`);
}

function dislike(postId) {
  return fetchWrapper.put(`${baseUrl}/dislike/${postId}`);
}

function getStickersName() {
  return fetchWrapper.get(`${baseUrl}/stickers`);
}

function uploadImage(params) {
  return fetchWrapper.post_file(`${baseUrl}/image-upload`, params);
}

function uploadImageForUser(params) {
  return fetchWrapper.post(`${baseUrl}/image-upload`, params);
}

function createNewPost(params) {
  return fetchWrapper.post(`${baseUrl}`, params);
}

function createCommentary(postId, comment) {
  return fetchWrapper.post(`${baseUrl}/comment/${postId}`, {commentary: comment});
}

function getComments(params) {
  return fetchWrapper.post(`${baseUrl}/comment`, params);
}

function getPostCommentsCount(postId) {
  return fetchWrapper.get(`${baseUrl}/comment/count/${postId}`);
}