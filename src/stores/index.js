import UiStore from './UiStore'
import ModalStore from './ModalStore'
import ProductStore from './ProductStore'
import CheckoutStore from './CheckoutStore'
import UserStore from './UserStore'
import OrderStore from './OrderStore'
import ZipStore from './ZipStore'
import ContentStore from './ContentStore'
import HelpStore from './HelpStore'

const store =  {
  ui: UiStore,
  content: ContentStore,
  product: ProductStore,
  modal: ModalStore,
  user: UserStore,
  zip: ZipStore,
  checkout: CheckoutStore,
  help: HelpStore,
  order: OrderStore
}

export default store
