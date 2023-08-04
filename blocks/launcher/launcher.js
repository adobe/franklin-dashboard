import { readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the launcher block
 * @param {Element} block The launcher block element
 */
export default async function decorate(block) {
  // read block params
  const cfg = readBlockConfig(block);
  const { action } = cfg;
  const showurl = cfg.url;

  // set form defaults if already in URL
  const currentpage = new URL(window.location.href);
  const params = currentpage.searchParams;
  const url = params.get('url') || '';
  const domainkey = params.get('domainkey') || '';

  // this block is used on two pages
  // the main page requires a url
  // and there is a secondary page designed for all domains for which we hide the url
  let form = `
    <form method="get" action="${action}">
        <input type="hidden" name="interval" value="30">
        <input type="hidden" name="offset" value="0">
        <input type="hidden" name="limit" value="100">
        <label for="domainkey">domainkey</label>
        <input id="domainkey" name="domainkey" value="${domainkey}" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">
  `;
  if (showurl === 'true') {
    form += `
        <label for="url">hostname</label>
        <input id="url" name="url" value="${url}" placeholder="www.adobe.com">
    `;
  }
  form += `
        <button>Go</button>
    </form>
  `;

  block.innerHTML = form;
}
