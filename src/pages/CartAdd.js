import LoginForm from 'forms/authentication/LoginForm';
import { Component } from 'react';
import { connect } from '../utils';

class CartAdd extends Component {
  constructor(props) {
    super(props);

    this.userStore = this.props.store.user;
    this.modalStore = this.props.store.modal;
    this.modalV2Store = this.props.store.modalV2;
  }

  componentDidMount() {
    this.userStore.getStatus().then((status) => {
      if (!status) {
        this.modalV2Store.open(<LoginForm />);
        this.props.store.routing.push('/main');
      } else {
        this.props.store.routing.push('/main');
      }
      this.userStore.cameFromCartUrl = true;
    });
  }

  render() {
    return null;
  }
}

export default connect('store')(CartAdd);
