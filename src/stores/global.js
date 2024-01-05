import { create } from 'zustand';

export const useStore = create((set) => ({
  domainKey: null,
  globalUrl: null,
  reportUrl: null,
  reportGenerated: null,
  startDate: null,
  endDate: null,

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
  setReportUrl: (value) => {
    // save to localstorage

    if(value){
      localStorage.setItem('reportUrl', value);
    }
    set(() => ({reportUrl: value}));
  },
  setStartDate: (value) => {
    // save to localstorage

    if(value){
      localStorage.setItem('startDate', value);
    }
    set(() => ({startDate: value}));
  },
  setEndDate: (value) => {
    // save to localstorage

    if(value){
      localStorage.setItem('endDate', value);
    }
    set(() => ({endDate: value}));
  },
  setReportGenerated: (value) => {
    // save to localstorage

    if(value){
      localStorage.setItem('reportGenerated', value);
    }
    set(() => ({reportGenerated: value}));
  },
}));

export const initStore = () => {
  const {
    setDomainKey,
    setGlobalUrl,
    setReportUrl,
  } = useStore.getState();

  // remove values from localstorage
  localStorage.removeItem('domainKey');
  localStorage.removeItem('globalUrl');
  localStorage.removeItem('reportUrl');

  setDomainKey(null);
  setGlobalUrl(null);
  setReportUrl(null);
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
