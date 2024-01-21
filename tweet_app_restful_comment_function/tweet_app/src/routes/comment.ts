import {Comment} from "@/models/comment";
import {Post} from "@/models/post";
import express from "express";

export const commentRouter = express.Router();
commentRouter.post("/posts/:postId/comments", async (req, res) => {
  const userId = req.authentication?.currentUserId;
  if (!userId) {
    res.status(401).render("401");
    return;
  }

  const {postId} = req.params;
  const post = await Post.find(Number(postId));
  if (!post) {
    res.status(404).render("404");
    return;
  }

  const {content} = req.body;
  const comment = new Comment(userId, Number(postId), content);
  await comment.save();

  req.dialogMessage?.setMessage("Comment successfully created");
  res.redirect(`/posts/${postId}`);
});

commentRouter.get(
  "/posts/:postId/comments/:commentId/edit",
  async (req, res) => {
    const userId = req.authentication?.currentUserId;
    if (!userId) {
      res.status(401).render("401");
      return;
    }

    const {postId} = req.params;
    const post = await Post.find(Number(postId));
    if (!post) {
      res.status(404).render("404");
      return;
    }

    const {commentId} = req.params;
    const comment = await Comment.find(Number(commentId));
    if (!comment) {
      res.status(404).render("404");
      return;
    }

    if (userId !== comment.userId) {
      res.status(403).render("403");
      return;
    }

    res.render("comments/edit", {
      comment,
    });
  }
);

commentRouter.patch("/posts/:postId/comments/:commentId", async (req, res) => {
  const userId = req.authentication?.currentUserId;
  if (!userId) {
    res.status(401).render("401");
    return;
  }

  const {postId} = req.params;
  const post = await Post.find(Number(postId));
  if (!post) {
    res.status(404).render("404");
    return;
  }

  const {commentId} = req.params;
  const comment = await Comment.find(Number(commentId));
  if (!comment) {
    res.status(404).render("404");
    return;
  }

  if (userId !== comment.userId) {
    res.status(403).render("403");
    return;
  }

  const {content} = req.body;
  comment.content = content;
  await comment.update();

  req.dialogMessage?.setMessage("Comment successfully updated");
  res.redirect(`/posts/${postId}`);
});

commentRouter.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const userId = req.authentication?.currentUserId;
  if (!userId) {
    res.status(401).render("401");
    return;
  }

  const {postId} = req.params;
  const post = await Post.find(Number(postId));
  if (!post) {
    res.status(404).render("404");
    return;
  }

  const {commentId} = req.params;
  const comment = await Comment.find(Number(commentId));
  if (!comment) {
    res.status(404).render("404");
    return;
  }

  if (userId !== comment.userId) {
    res.status(403).render("403");
    return;
  }

  await comment.delete();

  req.dialogMessage?.setMessage("Comment successfully deleted");
  res.redirect(`/posts/${postId}`);
});
