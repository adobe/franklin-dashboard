import { readBlockConfig, getUrlBase } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const params = new URLSearchParams(window.location.search);

  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
  const endpoint = cfg.data;
  const tableColumn = cfg.field;

  const domainInfo = document.createElement('script');
  domainInfo.type = 'text/partytown';
  // echartsScript.src ='../../scripts/test.js'
  domainInfo.async = true;
  domainInfo.innerHTML = `
    (async function(){
        //data will live in this variable res
        let res;
        //request data
        const resp = await fetch('${getUrlBase(endpoint)}${endpoint}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: '${params}'
        });
        const data = await resp.json();
        console.log(data);
    })();`;

  block.append(domainInfo);
}

function checkData() {
  if (Object.hasOwn(window, 'dashboard')) {
    console.log('going to wait');
    window.setTimeout(checkData, 100);
    console.log('i am out now');
  } else {
    window.dashboard = {
      dataIncoming: true,
    };
  }
}

(async function () {
  checkData();
}());
