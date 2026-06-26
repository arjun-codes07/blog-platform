import api from './axios.js';

export const getComments   = (postId)  => api.get(`/comments/${postId}`);
export const addComment    = (postId, data) => api.post(`/comments/${postId}`, data);
export const deleteComment = (id)      => api.delete(`/comments/${id}`);