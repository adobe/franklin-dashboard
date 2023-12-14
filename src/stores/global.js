import { create } from 'zustand';

export const useStore = create((set) => ({
  domainKey: null,
  globalUrl: null,
  setDomainKey: (value) => {
    // save to localstorage

    if (value) {
      localStorage.setItem('domainKey', value);
    }

    set(() => ({ domainKey: value }));
  },
  setGlobalUrl: (value) => {
    // save to localstorage

    if (value) {
      localStorage.setItem('globalUrl', value);
    }
    set(() => ({ globalUrl: value }));
  },
}));

export const initStore = () => {
  const {
    setDomainKey,
    setGlobalUrl,
  } = useStore.getState();

  // remove values from localstorage
  localStorage.removeItem('domainKey');
  localStorage.removeItem('globalUrl');

  setDomainKey(null);
  setGlobalUrl(null);
};

export const initializeStoreFromLocalStorage = () => {
  const {
    setDomainKey,
    setGlobalUrl,
  } = useStore.getState();

  const domainKey = localStorage.getItem('domainKey');
  const globalUrl = localStorage.getItem('globalUrl');

  if (domainKey) {
    setDomainKey(domainKey);
  }

  if (globalUrl) {
    setGlobalUrl(globalUrl);
  }
};
