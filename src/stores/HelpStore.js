import {observable, decorate, action } from 'mobx'
import { 
  API_HELP_GET_HELP_TOPICS, 
  API_HELP_GET_CONTACT,
  API_HELP_SEARCH,
  API_HELP_GET_QUESTION_SINGLE
} from '../config'
import axios from 'axios'

class HelpStore{

  questions = []
  question = {}
  topics = []
  contact = []
  activeTopics = 'All'

  async getHelpTopics(){
    const resp = await axios(API_HELP_GET_HELP_TOPICS)
    this.topics = resp.data
  }

  async getContact(){
    const resp = await axios(API_HELP_GET_CONTACT)
    this.contact = resp.data
  }

  async getQuestions(id){
    const resp = await axios(`${API_HELP_GET_QUESTION_SINGLE}${id}`)
    this.questions = resp.data.questions
    this.activeTopics = resp.data.topic
    return this.questions
  }


  async search(terms) {
    const res = await axios(API_HELP_SEARCH + terms)
    return res.data
  }

  getDetail(id) {
    return this.questions.find((d, v) => {
      return d._id === id
    })
  }
}

decorate(HelpStore, {
  questions: observable,
  getQuestions: action,
  activeTopics: observable,

  quesion: observable,
  getQuestion: action,

  topics: observable,
  getHelpTopics: action,

  contact: observable,
  getContact: action,
  getDetail: action,

})

export default new HelpStore()
