import {observable, decorate, action} from 'mobx'
import {
  API_BLOG_POST
} from '../config'
import axios from 'axios'

let index = 0

class ContentStore {
  blogPost = ''


  async getBlogPost(data) {
    const res = await axios.get(API_BLOG_POST)
    return res.data
  }
}

decorate(ContentStore, {
  blogPost: observable,

  getBlogPost: action
})


export default new ContentStore()
