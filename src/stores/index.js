import UiStore from './UiStore'
import ModalStore from './ModalStore'
import ProductStore from './ProductStore'
import CheckoutStore from './CheckoutStore'
import UserStore from './UserStore'
import OrderStore from './OrderStore'
import ZipStore from './ZipStore'
import ContentStore from './ContentStore'
import HelpStore from './HelpStore'
import AdminStore from './AdminStore'
import PackagingUnitStore from "./PackagingUnitStore";

const store =  {
  ui: UiStore,
  content: ContentStore,
  product: ProductStore,
  packagingUnit: PackagingUnitStore,
  modal: ModalStore,
  user: UserStore,
  zip: ZipStore,
  checkout: CheckoutStore,
  help: HelpStore,
  order: OrderStore,
  admin: AdminStore,
}

export default store
