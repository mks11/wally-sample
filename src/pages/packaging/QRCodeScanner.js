import React, {Component, Suspense, lazy} from "react";
import {Link} from 'react-router-dom'
import QrReader from 'react-qr-reader'
import Paper from "@material-ui/core/Paper/Paper";
import LazyLoad from 'react-lazyload';

import {isMobile} from "react-device-detect";


const desktopBrowserStyle = {
    content: {
        zindex: -1,
        position: 'absolute', left: '50%', top: '20%',
        width: '40%',
        height: '40%',
        transform: 'translate(-50%, -50%)'
    }
};

const mobileBrowserStyle = {
    mobile: {
        zindex: 1,
        position: 'absolute',
        left: '50%', top: '35%',
        width: '60%',
        height: '60%',
        transform: 'translate(-50%, -50%)'
    },
};


class QRCodeScanner extends Component {
    state = {
        result: 'No result',
    }

    // localMediaStream.getTracks()[0].stop()


    constructor(props) {
        super(props);

        //this.adminStore = props.store.admin;

        this.state = {
            name: '',
            paypal_email: '',
            busy: false,
            isPortrait: true
        };
    }

    componentDidMount() {
        console.log('ismobile ', isMobile)
        window.addEventListener('orientationchange', this.setScreenOrientation)
    }


    setScreenOrientation = () => {


        if (window.matchMedia("(orientation: portrait)").matches) {
            console.log('orientation: portrait');
            this.setState({
                isPortrait: true
            });
        }

        if (window.matchMedia("(orientation: landscape)").matches) {
            this.setState({
                isPortrait: false
            });
        }

        // alert(this.state.isPortrait);

        console.log('screen orientation portrait', this.state.isPortrait)
    };


    handleScan = data => {
        if (data) {

            console.log('qr data ', data);
            //www.thewallyshop.co/packaging/{PackagingUnit.id} encode in QR url format

            var domain = data.split('/');
            try {
                var packagingUnitId = domain[domain.length - 1]
            } catch (e) {
                console.log('link format error');
                this.setState({result: "link format error"})
            }

            this.setState({
                result: 'packaging Unit Id = ' + packagingUnitId
            });

            //callback to cartItemOrder with packagingUnitId
            this.props.makePatchAPICallLinkPackaging(packagingUnitId);

            //auto close QR popup after request is done
            this.props.onClose();
        }
    };
    handleError = err => {
        console.error(err)
    };

    render() {
        if (!this.props.isOpen) {
            return null;
        }

        // alert("renter portrait ", this.state.isPortrait)

        return (
            <LazyLoad>
                <div className="error">
                    <div className="backdrop">

                        <LazyLoad>
                            <Paper
                                style={isMobile ? mobileBrowserStyle.mobile : desktopBrowserStyle.content}>
                                <button className="error-modal-button"
                                        onClick={this.props.onClose}>
                                    X
                                </button>

                                <LazyLoad>
                                    <QrReader
                                        delay={300}
                                        onError={this.handleError}
                                        onScan={this.handleScan}
                                        props
                                    />
                                    <p>{this.state.result}</p>
                                </LazyLoad>

                            </Paper>
                        </LazyLoad>

                    </div>
                </div>
            </LazyLoad>
        )
    }
}


export default QRCodeScanner;