const { Router } = require('express')
const User = require('../models/user')
const router = Router()

router.get('/signin', (req, res) => {
  res.render('signin')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

// router.post("/signin", async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !user.isValidPassword(password)) {
//         return res.redirect("/");
//     }
// })

router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password)

    // console.log('token: ', token)
    return res.cookie('token', token).redirect('/')
  } catch (error) {
    return res.render('signin', {
      error: 'Incorrect Email or Password'
    })
  }
})

router.post('/signup', async (req, res) => {
  const { fullname, email, password } = req.body
  await User.create({ fullname, email, password })
  return res.redirect('/user/signin')
})

router.get('/logout', (req, res) => {
  return res.clearCookie('token').redirect('/');
})
// User.create({
//   fullname: "John Doe",
//   email: "john@example.com",
//   password: "mypassword123"
// }).then(() => console.log("User saved!"));

module.exports = router
