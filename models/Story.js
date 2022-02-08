const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const StorySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, opts)

StorySchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/pets/${this._id}">${this.name}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`
});



StorySchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
      await User.deleteMany({
          _id: {
              $in: doc.stories
          }
      })
  }
})

module.exports = mongoose.model('Story', StorySchema)
