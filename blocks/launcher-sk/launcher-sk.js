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
    const url = params.get('referrer') || '';
    const domainkey = params.get('domainkey') || localStorage.getItem('domainkey') || '';
  
    // TODO update action attribute to point to correct main page
    block.innerHTML = `
    <form method="get" action="${cfg.action}">
        <input type="hidden" name="interval" value="7">
        <input type="hidden" name="offset" value="0">
        <input type="hidden" name="limit" value="1">
        <input type="hidden" name="exactmatch" value=true>
        <input type="hidden" name="url" value="${url}">
        <label for="domainkey">domainkey</label>
        <input id="domainkey" name="domainkey" value="${domainkey}" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">
        <button>Go</button>
    </form>
      `;
  }