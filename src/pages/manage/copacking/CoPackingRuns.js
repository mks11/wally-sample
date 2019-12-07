import React, { Component } from 'react'
import {
  Row,
  Col,
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
import { BASE_URL } from 'config'
import { connect } from 'utils'

class ManageCoPackingRuns extends Component {
  constructor(props) {
    super(props)

    this.userStore = props.store.user
    this.adminStore = props.store.admin
    this.routing = props.store.routing
    this.modalStore = props.store.modal

    this.state = {
      copackingruns: [],
    }
  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (!status || user.type !== 'admin') {
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
    this.routing.push(`/manage/co-packing/${id}`)
  }

  render() {
    const {
      copackingruns
    } = this.state

    return (
      <div className="App">
        <Title content="Co-Packing Runs" />
        <Container>
          <Paper elevation={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Co-Packing Process</TableCell>
                  <TableCell># SKUs</TableCell>
                  <TableCell>Est. # Jars</TableCell>
                  <TableCell>Est. Time (mins)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {copackingruns.map(run => (
                  <TableRow
                    key={run.process}
                    className="clickable-row"
                    onClick={() => this.handleRowClick(run.id)}
                  >
                    <TableCell align="left">{run.process}</TableCell>
                    <TableCell>{run.skus}</TableCell>
                    <TableCell>{run.jars}</TableCell>
                    <TableCell>{run.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Row>
            <Col className="p-4 text-center" sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
              <button className="btn btn-main active">Scan Inbound UPC</button>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default connect("store")(ManageCoPackingRuns)
