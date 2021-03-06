//problem 생성 및 삭제
const problemRouter = require("express").Router()
const Problem = require("../models/Problem")


problemRouter.post("/", async (req, res, next) => {
  try {
    const { Title, Description, TestCase, Difficulty, Keyword } = req.body
    if (
      Title === undefined ||
      Description === undefined ||
      TestCase === undefined
    )
      throw new Error("fill problem property")
    const Writer = req.user._id,
      NumOfCorrect = 0,
      NumOfSubmit = 0
    const problem = new Problem({
      Title,
      Description,
      TestCase,
      Writer,
      Difficulty,
      Keyword,
      NumOfCorrect,
      NumOfSubmit,
      Date: new Date(),
    })
    const savedProblem = await problem.save()

    return res.status(200).json({ success: true, savedProblem })
  } catch (err) {
    next(err)
  }
})
problemRouter.patch("/:id", async (req, res, next) => {
  try {
    const origin = await Problem.findById(req.params.id)

    if (!origin) throw new Error("invalid problem id")
    if (req.user._id.toString() != origin.Writer.toString())
      throw new Error("not writer")

    const { Title, Description, TestCase, Difficulty, Keyword } = req.body
    if (
      Title === undefined &&
      Description === undefined &&
      TestCase === undefined &&
      Difficulty === undefined &&
      Keyword === undefined
    )
      throw new Error("plz fill at least one")
    let target = {}
    if (Title) {
      target.Title = Title
    }
    if (Description) {
      target.Description = Description
    }
    if (TestCase) {
      target.TestCase = TestCase
    }
    if (Difficulty) {
      target.Difficulty = Difficulty
    }
    if (Keyword) {
      target.Keyword = Keyword
    }
    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      target,
      { new: true }
    )
    if (!updatedProblem) throw new Error("invalid problem id when updating")

    return res.status(200).json({ success: true, updatedProblem })
  } catch (err) {
    next(err)
  }
})
problemRouter.delete("/:id", async (req, res, next) => {
  try {
    const origin = await Problem.findById(req.params.id)
    if (!origin) throw new Error("invalid problem id")
    if (req.user._id.toString() !== origin.Writer.toString())
      throw new Error("not writer")

    const deletedProblem = await Problem.findByIdAndDelete(req.params.id)
    if (!deletedProblem) throw new Error("can not delete no problem")
    return res.status(200).json({ success: true, deletedProblem })
  } catch (err) {
    next(err)
  }
})

module.exports = problemRouter
