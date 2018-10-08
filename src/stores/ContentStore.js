import {observable, decorate, action} from 'mobx'
import {
  API_BLOG_POST
} from '../config'
import axios from 'axios'

let index = 0

class ContentStore {
  blog = []


  async getBlogPost(data) {
    const res = await axios.get(API_BLOG_POST)
    this.blog = res.data
    return res.data
  }
}

decorate(ContentStore, {
  blog: observable,

  getBlogPost: action
})


export default new ContentStore()
