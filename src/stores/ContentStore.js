import { observable, decorate, action } from "mobx";
import { API_BLOG_POSTS_INDEX } from "../config";
import axios from "axios";

class ContentStore {
  blog = [];

  async getBlogPosts() {
    const res = await axios.get(API_BLOG_POSTS_INDEX);
    console.log(res.data);
    this.blog = res.data;
    return res.data;
  }
}

decorate(ContentStore, {
  blog: observable,
  getBlogPost: action,
});

export default new ContentStore();
