import {observable, decorate, action } from 'mobx'
import { 
  API_HELP_GET_QUESTION, 
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

  async getQuestions(){
    const resp = await axios(API_HELP_GET_QUESTION)
    this.questions = resp.data
  }

  async getHelpTopics(){
    const resp = await axios(API_HELP_GET_HELP_TOPICS)
    this.topics = resp.data
  }

  async getContact(){
    const resp = await axios(API_HELP_GET_CONTACT)
    this.contact = resp.data
  }

  async getQuestion(id){
    const resp = await axios(`${API_HELP_GET_QUESTION_SINGLE}/${id}`)
    this.question = resp.data
  }

  async search(terms) {
    const res = await axios(API_HELP_SEARCH + terms)
    return res.data
  }
}

decorate(HelpStore, {
  questions: observable,
  getQuestions: action,

  quesion: observable,
  getQuestion: action,

  topics: observable,
  getHelpTopics: action,

  contact: observable,
  getContact: action,

})

export default new HelpStore()
