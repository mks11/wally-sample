import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';

class BoxOrder extends Component{
  constructor(props){
    super(props)
    this.state = {
      data: []
    }
  }

  renderList(){
    const list = this.props.data.map((item, key) => {

      let icon = item.icon ? (<i className={`list-icon fa fa-1x ${item.icon}`}></i>) : ''

      return (
        <li key={key} className="list-bordered list-group-item d-flex justify-content-between align-items-center">
          <div className="row">
            {icon}
            <Link className="list-link" to={""}><h4> {item.name} </h4></Link>
          </div>
          <span className="badge badge-pill">
            <i className="fa fa-chevron-right fa-2x"></i>
          </span>
        </li>
      )
    })

    return (
      <ul className="list-group list-group-flush">
          { list }
      </ul>
    )
  }

  renderViewAll(){
    const { title, viewAll, methodName } = this.props
    const route = {
      pathname: viewAll,
      state: {
        title,
        methodName
      }
    }

    return viewAll ? (
      <Link to={route} className="view-all">
        View All
      </Link>
    ) : ""
  }

  render(){
    const { title } = this.props
  
    return (
      <div className="list">
        <div className="list-header">
          <div className="row">
            <div className="col-10">
              <h2>{title}</h2>
            </div>
            <div className="col-2">
                { this.renderViewAll() }
            </div>
          </div>
        </div>
        
        { this.renderList() }

      </div>
    )
  }
}

BoxOrder.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string.isRequired,
  viewAll: PropTypes.string
}

export default BoxOrder
