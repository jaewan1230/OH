//글작성 및 삭제
const postRouter = require("express").Router()
const Post = require("../models/Post")


postRouter.post("/", async (req, res, next) => {
  try {
    const { Title, Body } = req.body
    const Writer = req.user._id,
      NumOfView = 0
    const post = new Post({
      Title,
      Body,
      Writer,
      NumOfView,
      Date: new Date(),
      Nickname : req.user.Nickname
    })
    const savedPost = await post.save()
    console.log(savedPost)
    return res.status(200).json({ success: true, savedPost })
  } catch (err) {
    next(err)
  }
})
postRouter.patch("/:id", async (req, res, next) => {
  try {
    const origin = await Post.findById(req.params.id)
    if (!origin) throw new Error("invalid post id")
    if (req.user._id.toString() !== origin.Writer.toString())
      throw new Error("not writer")

    const { Title, Body } = req.body
    if (Title === undefined && Body === undefined)
      throw new Error("plz fill at least one")
    let target = {}
    if (Title) {
      target.Title = Title
    }
    if (Body) {
      target.Body = Body
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, target, {
      new: true,
    })
    if (!updatedPost) throw new Error("invalid post id when updating")
    return res.status(200).json({ success: true, updatedPost })
  } catch (err) {
    next(err)
  }
})
postRouter.delete("/:id", async (req, res, next) => {
  try {
    const origin = await Post.findById(req.params.id)
    if (!origin) throw new Error("invalid post id")
    if (req.user._id.toString() !== origin.Writer.toString())
      throw new Error("not writer")

    const deletedPost = await Post.findByIdAndDelete(req.params.id)
    if (!deletedPost) throw new Error("can not delete no post")
    return res.status(200).json({ success: true, deletedPost })
  } catch (err) {
    next(err)
  }
})

module.exports = postRouter
