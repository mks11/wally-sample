import React, {  Fragment, Component  } from 'react'

class Title extends Component {
        
        render(){
                const { content } = this.props
                return (
                        <Fragment>
                                <div className="container">
                                        <div className="page-header">
                                                <div className="page-title">
                                                        <h1 className="mb-1">{ content }</h1>
                                                </div>
                                        </div>
                                </div>
                        </Fragment>
                )
        }
}

export default Title
