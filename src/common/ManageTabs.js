import React from "react";
import { Link } from 'react-router-dom'

const manageTabsRouter = [
  {
    id: 'shopper',
    title: 'Shopper',
    linkTo: '/manage/shopper'
  },
  {
    id: 'fulfillment',
    title: 'Fulfillment',
    linkTo: '/manage/fulfillment'
  },
  {
    id: 'delivery',
    title: 'Delivery',
    linkTo: '/manage/delivery'
  },
  {
    id: 'admin',
    title: 'Admin',
  },

  {
    id: 'customerservice',
    title: 'Customer Service',
  },
]

const Tab = ({ item, page }) => {
  return (
    <div className="col">
      <div className={`nav-link ${item.id === page ? 'active-tab' : ''}`}>
        {
          (item.id === page || !item.linkTo)
            ? item.title
            : (<Link to={item.linkTo}>{item.title}</Link>)
        }
        
      </div>
    </div>
  )
}

const ManageTabs = ({ page }) => {
  return (
    <div className="admin-tabs mt-3">
      <div className="container">
        <div className="row">
          {
            manageTabsRouter.map(item => {
              return (
                <Tab {...{ item, page }}/>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default ManageTabs
