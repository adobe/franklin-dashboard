import { readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the top pages block
 * @param {Element} block The top pages block element
 */
export default async function decorate(block) {
  // TODO determine if any block params required or if autoblocking preferred
  // read block params
  const cfg = readBlockConfig(block);

  // set form defaults if already in URL
  const currentpage = new URL(window.location.href);
  const params = currentpage.searchParams;
  const url = params.get('referrer') || null;
  const hostname = url ? new URL(url.startsWith('https://') ? url : "https://"+url).hostname : ''
  const domainkey = params.get('domainkey') || hostname ? localStorage.getItem(hostname) : '';
  if(domainkey){
    location.replace(`/views/${cfg.action}?${params.toString()}&interval=30&offset=0&limit=10&exactmatch=true&threshold=0&url=${url}`);
  }

  // TODO update action attribute to point to correct main page
  block.innerHTML = `
    <form method="get" action="${cfg.action}">
        <input type="hidden" name="interval" value="30">
        <input type="hidden" name="offset" value="0">
        <input type="hidden" name="limit" value="10">
        <input type="hidden" name="exactmatch" value=true>
        <input type="hidden" name="threshold" value=0.01>
        <input type="hidden" name="url" value="${url}">
        <label for="domainkey">domainkey</label>
        <input id="domainkey" name="domainkey" value="${domainkey ? domainkey : ''}" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">
        <button>Go</button>
    </form>
      `;
}
