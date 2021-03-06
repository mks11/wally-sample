/* eslint-disable */
/* TODO: Determine the utility of this component- It's not clear what its purpose is or why it is disabled. */
import React from "react";
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'

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
    id: 'blog',
    title: 'Blog',
    linkTo: '/manage/blog'
  },
  {
    id: 'admin',
    title: 'Admin',
  },

  {
    id: 'customerservice',
    title: 'Customer Service',
  },
  {
    id: 'shipping',
    title: 'Shipping',
    linkTo: '/manage/shipping'
  },
  {
    id: 'printing',
    title: 'Printing',
    linkTo: '/manage/printing'
  },

]

const Tab = ({ item, page }) => {
  return (
    <Col>
      <div className={`nav-link ${item.id === page ? 'active-tab' : ''}`}>
        {
          (item.id === page || !item.linkTo)
            ? item.title
            : (<Link to={item.linkTo}>{item.title}</Link>)
        }
        
      </div>
    </Col>
  )
}

const ManageTabs = ({ page }) => {
  return null // todo remove this line to get old admin tabs
  // return (
  //   <div className="admin-tabs mt-3">
  //     <Container>
  //       <Row>
  //         {
  //           manageTabsRouter.map(item => {
  //             return (
  //               <Tab {...{ item, page }} key={item.id} />
  //             )
  //           })
  //         }
  //       </Row>
  //     </Container>
  //   </div>
  // )
}

export default ManageTabs
