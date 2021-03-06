const express = require("express")
const path = require("path")
const app = new express()
const ejs = require("ejs")
const axios = require("axios")
const cookieParser = require("cookie-parser")
const config = require("./config")

const backURL = config.backURL
const cors = require("cors")
app.locals.frontURL = config.frontURL
app.locals.backURL = backURL
app.set("view engine", "ejs")
app.use(cors())
app.use(cookieParser())
app.use(express.static("public"))
app.get("/test",(req,res)=>{
  res.send("hi")
})
app.get("/", async function (req, res) {
  console.log("start")
  const result_problem = await axios.get(
    backURL + "/problem_no_auth"
  )
  console.log("result ",result_problem)
  const problems = result_problem.data.problems
  const NumOfProblems = problems.length < 10 ? problems.length : 10
  const result_post = await axios.get(backURL + "/post_no_auth")
  const posts = result_post.data.posts
  const NumOfPosts = posts.length < 10 ? posts.length : 10
  const result_user = await axios.get(backURL + "/user_no_auth/ranking")
  const users = result_user.data.users
  users.sort(function (a, b) {
    return b.Score - a.Score
  })
  const NumOfUsers = users.length < 10 ? users.length : 10
  const num = [NumOfProblems, NumOfPosts, NumOfUsers]
  res.render("index", { problems, posts, users, num })
})

app.get("/problem_submit", async function (req, res) {
  res.render("problem_submit")
})
app.get("/problem_list", async function (req, res) {
  console.log(req.cookies.token)
  const result = await axios.get(backURL + "/problem_no_auth")
  const problems = result.data.problems
  for (var i = 0; i < problems.length; i++) {
    problems[i].Rate = problems.NumOfSubmit
      ? problems.NumOfSubmit / problems.NumOfCorrect
      : 0
  }
  // console.log(problems);
  res.render("problem_list", { problems })
})
app.get("/problem_detail/:id", async function (req, res) {
  console.log("id is ",req.params.id)
  const result = await axios.get(backURL + "/problem_no_auth/" + req.params.id)
  const data = result.data.problem
  console.log("detail " + JSON.stringify(data))
  res.render("problem_detail", { data, pro_id: req.params.id })
})

app.get("/community_list", async function (req, res) {
  const result = await axios.get(backURL + "/post_no_auth")
  let posts = result.data.posts
  console.log(posts)
  res.render("community_list", { posts })
})
app.get("/community_submit", async function (req, res) {
  res.render("community_submit")
})

app.get("/community_detail/:id", async function (req, res) {
  console.log(req.params.id)
  const result = await axios.get(backURL + "/post_no_auth/" + req.params.id)
  const result2 = await axios.get(
    backURL + "/comment_no_auth?RefPost=" + req.params.id
  )
  console.log(result2.data)
  const comments = result2.data.comments
  const data = result.data.post
  console.log(data)
  res.render("community_detail", { data, comments })
})

app.get("/ranking", async function (req, res) {
  console.log("rangking")
  const result = await axios.get(backURL + "/user_no_auth/ranking")
  users = result.data.users
  users.sort(function (a, b) {
    return b.Score - a.Score
  })
  res.render("ranking", { users })
})

app.get("/about", function (req, res) {
  res.render("about")
})

app.get("/login", function (req, res) {
  res.render("login")
})

app.get("/register", function (req, res) {
  res.render("register")
})

app.get("/mypage", async function (req, res) {
  console.log("mypage")
  const result = await axios.get(backURL + "/user", {
    headers: { Authorization: "bearer " + req.cookies.token },
  })
  const user = result.data.user
  const result2 = await axios.get(backURL + "/score", {
    headers: { Authorization: "bearer " + req.cookies.token },
  })
  const scores = result2.data.scores
  console.log("scores ", scores)
  res.render("mypage", { user,scores })
  console.log("detail " + JSON.stringify(data))
})

//app.post()

app.listen(4000,"0.0.0.0", function () {
  console.log("App listening on port 4000")
})
