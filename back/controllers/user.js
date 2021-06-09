// 유저 생성, 로그인, 자기 정보 보기
const userRouter = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const saltRounds = 10

userRouter.get("/read", (req, res, next) => {
  try {
    return res.status(200).json({ success: true, user: req.user })
  } catch (err) {
    next(err)
  }
})
userRouter.get("/nickname/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (user.Nickname)
      return res.status(200).json({ success: true, nickname: user.Nickname })
    else throw new Error("invalid user id")
  } catch (err) {
    next(err)
  }
})
userRouter.post("/update", async (req, res, next) => {
  try {
    const { UserPassword, Nickname } = req.body
    if (UserPassword === undefined && Nickname === undefined)
      throw new Error("plz fill password or nickname")

    let target = {}
    if (Nickname) {
      const dup = await User.find({ Nickname })
      console.log(dup.length)
      if (dup.length) throw new Error("duplicated nickname")
      target.Nickname = Nickname
    }
    if (UserPassword) {
      const result = await bcrypt.compare(UserPassword, req.user.UserPassword)
      if (result) throw new Error("same password with prior one")
      const hashedPassword = bcrypt.hash(UserPassword, saltRounds)
      target.UserPassword = hashedPassword
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, target, {
      new: true,
    })
    return res.status(200).json({ success: true, updatedUser })
  } catch (err) {
    next(err)
  }
})
userRouter.delete("/delete", async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id)
    if (!deletedUser) {
      throw new Error("can not delete no user")
    }
    return res.status(200).json({ success: true, deletedUser })
  } catch (err) {
    next(err)
  }
})

module.exports = userRouter