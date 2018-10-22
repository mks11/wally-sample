import React, { Component } from 'react'
import {
  Container,
  Table,
  Button,
  Input,
} from 'reactstrap'
import { connect } from '../../utils'

class FulfillmentPlaceView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timeframe: this.props.timeframe,
      items: []
    }

    this.adminStore = this.props.store.admin
  }

  componentDidUpdate(_, prevState) {
    if (prevState.timeframe !== this.state.timeframe) {
      this.loadShopItems()
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.timeframe !== prevState.timeframe){
      return { timeframe: nextProps.timeframe }
    }
    else return null;
  }

  onLocationChange = (e) => {
    const value = e.target.value
    const productId = e.target.getAttribute('prod-id')
    const { shopitems } = this.adminStore

    const updateditems = shopitems.map(item => {
      if (item.product_id == productId) {
        item.warehouse_placement = value
      }
      return item
    })

    this.setState({
      items: updateditems
    })
  }

  loadShopItems = () => {
    const { timeframe } = this.state
    this.adminStore.getShopItems(timeframe, 'all')
  }

  submitLocations = () => {
    const { items } = this.state
    
    if (items.length) {
      const payload_items = items.map(item => {
        return {
          shopitem_id: item._id,
          location: item.warehouse_placement
        }
      })
      const payload = {
        locations: payload_items
      }
      this.adminStore.updateShopItemsWarehouseLocations(payload)
    }
  }

  render() {
    const { shopitems } = this.adminStore

    return (
      <Container>
        <h2 className="py-3">Place:</h2>
        <Table responsive className="place-table">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Cart Box</th>
              <th scope="col">Placement</th>
            </tr>
          </thead>
          <tbody>
            {
              shopitems && shopitems.map(item => {
                return (
                  <tr key={item.product_id} >
                    <td>{item.product_name}</td>
                    <td>{item.box_number}</td>
                    <td><Input placeholder="Enter placement" value={item.warehouse_placement || ''} onChange={this.onLocationChange} prod-id={item.product_id} /></td>
                  </tr>
                )
              })
            }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">
                {
                  shopitems && shopitems.length
                    ? <Button color="primary mt-4" onClick={this.submitLocations}>Submit</Button>
                    : null
                }
              </td>
            </tr>
          </tfoot>
        </Table>
      </Container>
    )
  }
}

export default connect('store')(FulfillmentPlaceView)
