import { fetchWrapper } from "../_api/fetch-wrapper.js";

const baseUrl = `/posts`;

export const postService = {
  getChunkPosts,
  isUserLikedPost,
  like,
  dislike,
  getStickersName
}

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