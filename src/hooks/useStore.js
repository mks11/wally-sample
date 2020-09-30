import { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';

export default function useStores() {
  const { store } = useContext(MobXProviderContext);
  return store;
}
