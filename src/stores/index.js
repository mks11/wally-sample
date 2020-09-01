import UiStore from "./UiStore";
import ModalStore from "./ModalStore";
import ProductStore from "./ProductStore";
import CheckoutStore from "./CheckoutStore";
import UserStore from "./UserStore";
import OrderStore from "./OrderStore";
import ZipStore from "./ZipStore";
import ContentStore from "./ContentStore";
import HelpStore from "./HelpStore";
import AdminStore from "./AdminStore";
import PackagingUnitStore from "./PackagingUnitStore";
import BackerStore from "./BackerStore";
import VendorProfileStore from "./VendorProfileStore";
import MetricStore from "./MetricStore";
import LoadingSpinnerStore from "./LoadingSpinnerStore";
import SnackbarStore from "./SnackbarStore";
import { RouterStore } from "mobx-react-router";

const store = {
  ui: UiStore,
  content: ContentStore,
  product: ProductStore,
  impulse_products: ProductStore,
  packagingUnit: PackagingUnitStore,
  modal: ModalStore,
  user: UserStore,
  zip: ZipStore,
  checkout: CheckoutStore,
  help: HelpStore,
  order: OrderStore,
  admin: AdminStore,
  backer: BackerStore,
  vendor: VendorProfileStore,
  products: VendorProfileStore,
  metric: MetricStore,
  loading: LoadingSpinnerStore,
  snackbar: SnackbarStore,
  routing: new RouterStore(),
};

export default store;
