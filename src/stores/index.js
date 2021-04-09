import UiStore from './UiStore';
import ModalStore from './ModalStore';
import ModalStoreV2 from './ModalStoreV2';
import ProductStore from './ProductStore';
import CheckoutStore from './CheckoutStore';
import UserStore from './UserStore';
import OrderStore from './OrderStore';
import ZipStore from './ZipStore';
import ContentStore from './ContentStore';
import HelpStore from './HelpStore';
import AdminStore from './AdminStore';
import PackagingUnitStore from './PackagingUnitStore';
import MetricStore from './MetricStore';
import LoadingSpinnerStore from './LoadingSpinnerStore';
import SnackbarStore from './SnackbarStore';
import { RouterStore } from 'mobx-react-router';
import PickPackStore from './PickPackStore';
import RetailStore from './RetailStore';
import DialogStore from './DialogStore';

const store = {
  ui: UiStore,
  content: ContentStore,
  product: ProductStore,
  impulse_products: ProductStore,
  packagingUnit: PackagingUnitStore,
  modal: ModalStore,
  modalV2: ModalStoreV2,
  user: UserStore,
  zip: ZipStore,
  checkout: CheckoutStore,
  help: HelpStore,
  order: OrderStore,
  admin: AdminStore,
  pickPack: PickPackStore,
  metric: MetricStore,
  loading: LoadingSpinnerStore,
  snackbar: SnackbarStore,
  routing: new RouterStore(),
  retail: RetailStore,
  dialog: DialogStore,
};

export default store;
