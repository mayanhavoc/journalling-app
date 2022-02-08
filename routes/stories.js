const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor } = require('../middleware/auth');
const Story = require('../models/Story');

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', isLoggedIn, (req, res) => {
  res.render('stories/add')
})


// @desc    Show all stories
// @route   GET /stories
router.get('/', isLoggedIn,  async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()
    res.render('stories/index', { stories })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})



// @desc    Process add form
// @route   POST /stories
router.post('/', isLoggedIn, async (req, res) => {
  // try {
  //   req.body.user = req.user.id
  //   await Story.create(req.body)
  //   req.flash('Success!', "You wrote a new story")
  //   res.redirect('/dashboard')
  //   console.log(story)
  // } catch (err) {
  //   console.error(err)
  //   res.render('error/500')
  // }
  req.body.user = req.user.id
  const story = await Story.create(req.body)
  req.flash('success', 'Successfully added a new story');
  res.redirect(`/dashboard`)
})

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id',  isLoggedIn, async (req, res) => {
  console.log(req.params)
  try {
    const story = await Story.findById(req.params.id).populate('user').lean()
    if (!story) {
      console.log('no story')
      return res.render('error/404')
    }
    if (story._id != req.user.id && story.status == 'private') {
      console.log('no match')
      res.render('error/404')
    } else {
      res.render('stories/show', { story })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', async (req, res) => {
  try {
    let story = await Story.findOne({
      _id: req.params.id,
    }).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      res.render('stories/edit', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})



// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', async (req, res) => {
    try {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
  })

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public',
        })
        .populate('user')
        .lean()

        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')

    }
  })

module.exports = router