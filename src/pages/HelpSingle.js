import React, { Component } from 'react'
import BoxOrder from '../common/page/help/BoxOrder';
import Title from '../common/page/Title';
import PropTypes from 'prop-types';
import { connect } from '../utils'

class HelpSingle extends Component {
  constructor(props){
    super(props)

    this.helpStore = this.props.store.help
  }

  renderTitle(){
    const { title } = this.props.location.state;
    return ( <Title content={title} /> )
  }

  renderBox(){
    const { title, methodName } = this.props.location.state;
    const data      = this.helpStore[methodName]
    return (
      <BoxOrder 
        title={title}
        data={data}
      />
    )
  }

  render(){
    return (
      <div className="app">
        { this.renderTitle() }
         <section className="page-section aw-our--story">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-xs-12">
                  { this.renderBox() }
                </div>
              </div>
          </div>
        </section>
      </div>
    );
  }
}

HelpSingle.propTypes =  {
  title: PropTypes.string
}

export default connect("store")(HelpSingle)
