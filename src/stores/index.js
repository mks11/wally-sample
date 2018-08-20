import UiStore from './UiStore'
import ModalStore from './ModalStore'
import ProductStore from './ProductStore'
import CheckoutStore from './CheckoutStore'
import UserStore from './UserStore'
import ZipStore from './ZipStore'
import HelpStore from './HelpStore'

const store =  {
  ui: UiStore,
  product: ProductStore,
  modal: ModalStore,
  user: UserStore,
  zip: ZipStore,
  checkout: CheckoutStore,
  help: HelpStore
}

export default store
