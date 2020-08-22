import React from 'react';
import { connect } from 'utils';
import NewReturnForm from './NewReturnForm';
import Page from '../shared/Tab';
import styles from './index.module.css';
import { Observer } from 'mobx-react';

function NewPackagingReturn({
  store: { user: userStore, loading: loadingStore, modal: modalStore },
}) {
  const user_id = userStore.user && userStore.user._id;

  return (
    <Observer>
      {() => (
        <Page
          title="New Packaging Return"
          className={styles.pageContainer}
          maxWidth="sm"
        >
          <NewReturnForm
            user_id={user_id}
            loadingStore={loadingStore}
            userStore={userStore}
            modalStore={modalStore}
          />
        </Page>
      )}
    </Observer>
  );
}

//mobx v5 fix
class A extends React.Component {
  render() {
    return <NewPackagingReturn {...this.props} />;
  }
}

export default connect('store')(A);
