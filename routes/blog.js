const { Router } = require('express')
const router = Router()
const multer = require('multer')
const path = require('path')
const Blog = require('../models/blog')
const Comment = require('../models/comment');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/uploads/'))
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`
    cb(null, filename)
  }
})
const upload = multer({ storage: storage })


router.get('/add-new', (req, res) => {
  res.render('addblog', {
    user: req.user
  })
})


router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  // console.log("Comments:", comments);
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});


router.post('/comment/:blogId', async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  })
  return res.redirect(`/blog/${req.params.blogId}`)
})


router.post('/', upload.single('coverImage'), async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  const { title, body } = req.body
  const blog = await Blog.create({
    body,
    title,
    coverImageURL: req.file ? `/uploads/${req.file.filename}` : null,
    createdBy: req.user._id
  })
  return res.redirect(`/blog/${blog._id}`)
})

module.exports = router
