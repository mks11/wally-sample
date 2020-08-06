import React, { Component } from 'react'

class Box extends Component{
  constructor(props){
    super(props)
    this.state = {
      data: [
        {
          orderPlaced: 0,
          items: 8,
          total: "$27.99",
          helpLink: 'haha'
        },
        {
          orderPlaced: 0,
          items: 8,
          total: "$27.99",
          helpLink: 'haha'
        },
        {
          orderPlaced: 0,
          items: 8,
          total: "$27.99",
          helpLink: 'haha'
        }
      ]
    }
  }

  renderList(){
    const list = this.state.data.map((item, key) => {
      return (
        <li key={key} className="list-group-item">
            <div className="row">
            <div className="col-9">
            <table className="table table-sm borderless" > 
              <thead>
                <tr>
                  <th scope="col">Order Placed</th>
                  <th scope="col">Items</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{item.orderPlaced}</td>
                  <td>{item.items}</td>
                  <td>{item.total}</td>
                </tr>
              </tbody>
            </table>
            </div>

            <div className="col-3">
              <button className="help-btn">
                Help
              </button>
            </div>
            </div>
          </li>
      )
    })

    return (
      <ul className="list-group list-group-flush">
          { list }
      </ul>
    )
  }

  render(){
    return (
      <div className="list">
        <div className="list-header">
          <div className="row">
            <div className="col-10">
              <h2>Recent Orders</h2>
            </div>
            <div className="col-2">
                <span className="view-all">
                  View All
                </span>
            </div>
          </div>
        </div>
        
        { this.renderList() }

      </div>
    )
  }
}

export default Box
