import React, { Component } from 'react'

class SearchForm extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return (
      <form className="search-form">
          <i className="fa fa-search"></i>
          <input type="text"  placeholder="Search anything..." />
      </form>
    )
  }
}

export default SearchForm