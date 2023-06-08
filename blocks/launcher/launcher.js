// TODO determine if readBlockConfig required for this block
// import { readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the top pages block
 * @param {Element} block The top pages block element
 */
export default async function decorate(block) {
  // TODO determine if any block params required or if autoblocking preferred
  // read block params
  // const cfg = readBlockConfig(block);

  // set form defaults if already in URL
  const currentpage = new URL(window.location.href);
  const params = currentpage.searchParams;
  const url = params.get('url') || '';
  const domainkey = params.get('domainkey') || '';

  // TODO update action attribute to point to correct main page
  block.innerHTML = `
        <form method="get" action="./lists">
            <input type="hidden" name="interval" value="30">
            <input type="hidden" name="offset" value="0">
            <input type="hidden" name="limit" value="10">
            <label for="domainkey">domainkey</label>
            <input id="domainkey" name="domainkey" value="${domainkey}" placeholder="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa">
            <label for="url">hostname</label>
            <input id="url" name="url" value="${url}" placeholder="www.adobe.com">
            <button>Go</button>
        </form>
    `;
}
