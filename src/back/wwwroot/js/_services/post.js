import { fetchWrapper } from "../_api/fetch-wrapper.js";

const baseUrl = `/posts`;

export const postService = {
  getChunkPosts
}

function getChunkPosts(postId) {
  return fetchWrapper.get(`${baseUrl}/by-chunk/${postId ?? 0}`);
}