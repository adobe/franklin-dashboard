import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  readBlockConfig,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

async function getQueryInfo() {
  if (!Object.hasOwn(window, 'urlBase')) {
    await fetch('/configs/rum-queries.json')
      .then((resp) => resp.json())
      .then((data) => {
        window.urlBase = {};
        window.urlBase = data.data;
      });
  }
}

/**
 * configuration that selects correct base of url for a particular endpoint
 * @param {String} endpoint
 * @returns
 */
export function getUrlBase(endpoint) {
  const urlObj = window.urlBase.find((config) => config.endpoint === endpoint);
  return urlObj.base;
}

/**
 * configuration that selects correct params for a type of url
 * @param {String} endpoint
 * @returns
 */
export function getEndpointParams(endpoint) {
  const urlObj = window.urlBase.find((config) => config.endpoint === endpoint);
  return urlObj.parameters;
}

/**
 * takes block and preemptively fires off requests for resources in worker thread
 * @param {*} main
 */
export async function bulkQueryRequest(main) {
  // let's make a loader
  let chartCounter = 1;
  main
    .querySelectorAll('div.section > div > div')
    .forEach((block) => {
      const shortBlockName = block.classList[0];
      // create id for each chart
      if (shortBlockName === 'charts') {
        block.parentElement.id = `chart${chartCounter}`;
        block.id = `chart${chartCounter}`;
        chartCounter += 1;
      }
    });
  const loader = document.createElement('span');
  loader.className = 'loader';
  main.prepend(loader);
  let offset;
  let interval;

  const reqs = {};
  const params = new URLSearchParams(window.location.search);
  main.querySelectorAll('.section  .charts, .section .lists').forEach((chartBlock) => {
    let cfg = readBlockConfig(chartBlock);
    cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
    const endpoint = cfg.data;
    if (Object.hasOwn(reqs, endpoint)) {
      reqs[endpoint] += 1;
    } else {
      reqs[endpoint] = 1;
    }
  });

  if (params.has('startdate') && params.has('enddate')) {
    const start = new Date(params.get('startdate'));
    const end = new Date(params.get('enddate'));

    const today = new Date();

    if (start < end) {
      const offs = Math.abs(today - end);
      const intv = Math.abs(end - start);
      offset = Math.ceil(offs / (1000 * 60 * 60 * 24));
      interval = Math.ceil(intv / (1000 * 60 * 60 * 24));
    } else if (start === end) {
      offset = 1;
      interval = 1;
    } else {
      offset = -1;
      interval = -1;
    }
  }

  const promiseArr = [];
  Object.keys(reqs).forEach((key) => {
    const k = key.toLowerCase();
    params.set('interval', -1);
    params.set('offset', -1);
    if (getUrlBase(k) === 'interval' && params.has('startdate') && params.has('enddate')) {
      params.set('interval', interval);
      params.set('offset', offset);
    }
    promiseArr.push(`fetch('${getUrlBase(k)}${k}?${params.toString()}')
      .then((resp) => resp.json())
      .then((data) => {
        if(!Object.hasOwn(window, 'dashboard')){
          window.dashboard = {};
        } 
        window.dashboard['${k}'] = data;
      })
    `);
  });

  if (promiseArr.length > 0) {
    const consolidatedQueryCalls = `[${promiseArr.join(', ')}]`;
    const queryScript = document.createElement('script');
    queryScript.type = 'text/partytown';
    // queryScript.src ='../../scripts/test-conso.js'
    queryScript.async = true;
    queryScript.innerHTML = `

    
    
    function checkData(){
      if(Object.hasOwn(window, 'dataIncoming') && window.dataIncoming === true){
        window.setTimeout(checkData, 10);
      }else{
        window.dataIncoming = true;
        Promise.all(${consolidatedQueryCalls}).
        then(() => {
          window.dataIncoming = false;
          document.querySelector('.loader').remove();
        })
        .catch((err) => {
          alert('API Call Has Failed, Check that inputs are correct');
          document.querySelector('.loader').remove();
        });
      }
    }

    (async function(){
      checkData()
    })();`;
    main.append(queryScript);
  } else {
    document.querySelector('.loader').remove();
  }
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.replaceWith(link);
  } else {
    document.head.append(link);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await getQueryInfo().then(() => bulkQueryRequest(main));
  function createInlineScriptSrc(src, parent) {
    const script = document.createElement('script');
    script.type = 'text/partytown';
    script.src = src;
    parent.appendChild(script);
  }
  const ECHARTS = 'https://cdn.jsdelivr.net/npm/echarts@5.0/dist/echarts.min.js';

  createInlineScriptSrc(ECHARTS, document.head);
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  window.partytown = {
    lib: '/scripts/',
  };
  import('./partytown.js');

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.png`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
