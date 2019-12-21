import React, { Component } from 'react'
import {
  Modal,
  ModalBody,
  Container,
} from 'reactstrap'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'

import Title from 'common/page/Title'
import { connect } from 'utils'

import ScanUPCFooter from './ScanUPCFooter'

class ManageCoPackingRuns extends Component {
  constructor(props) {
    super(props)

    this.userStore = props.store.user
    this.adminStore = props.store.admin
    this.routing = props.store.routing
    this.modalStore = props.store.modal

    this.state = {
      copackingruns: [],
      isBarResultOpen: false,

      name: '',
      copacking_process: '',
      product_id: '',
      sku_id: '',
    }
  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (!status || !['admin', 'co-packer'].includes(user.type)) {
          this.props.store.routing.push('/')
        } else {
          this.loadCoPackingRunsData()
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/')
      })
  }

  loadCoPackingRunsData = () => {
    this.adminStore.getCopackingRuns()
      .then(data => {
        this.setState({ copackingruns: data })
      })
      .catch(error => {
        this.modalStore.toggleModal('error', 'Can\'t get co-packing runs')
      })
  }

  handleRowClick = id => {
    this.routing.push(`/manage/co-packing/runs/${id}`)
  }

  toggleBarResult = () => {
    if (this.state.isBarResultOpen) {
      this.setState({
        isBarResultOpen: false,
        name: '',
        copacking_process: '',
        product_id: '',
        sku_id: '',
      })
    } else {
      this.setState({
        isBarResultOpen: true,
      })
    }
  }

  handleUPCGet = res => {
    this.setState({
      name: res.name,
      copacking_process: res.copacking_process,
      product_id: res.product_id,
      sku_id: res.sku_id,
    })
  }

  render() {
    const {
      copackingruns,
      isBarResultOpen,

      name,
      copacking_process,
    } = this.state

    return (
      <div className="App co-packing-page">
        <Title content="Co-Packing Runs" />
        <Container>
          <Paper elevation={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" style={{ width: '60%' }}>Co-Packing Process</TableCell>
                  <TableCell># SKUs</TableCell>
                  <TableCell>Est. # Jars</TableCell>
                  <TableCell>Est. Time (mins)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {copackingruns.map(run => (
                  <TableRow
                    key={run._id}
                    className="clickable-row"
                    onClick={() => this.handleRowClick(run._id)}
                  >
                    <TableCell align="left">{run.copacking_process}</TableCell>
                    <TableCell>{run.products.length}</TableCell>
                    <TableCell>{run.estimated_units}</TableCell>
                    <TableCell>{Math.round(run.estimated_time / 60)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <ScanUPCFooter onUPCGet={this.handleUPCGet} />
        </Container>

        <Modal
          autoFocus={false}
          isOpen={isBarResultOpen}
          centered
        >
          <ModalBody>
            <button className="btn-icon btn-icon--close" onClick={this.toggleBarResult}></button>
            <div className="login-wrap">
              <p className="info-popup">
                {`Product Name: ${name}`}
              </p>
              <p className="info-popup">
                {`Co-packing Process: ${copacking_process}`}
              </p>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default connect("store")(ManageCoPackingRuns)
