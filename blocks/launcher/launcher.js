import { readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the top pages block
 * @param {Element} block The top pages block element
 */
export default async function decorate(block) {
    // read block params
    const cfg = readBlockConfig(block);

    // set form defaults if already in URL
    let currentpage = new URL(window.location.href);
    var params = currentpage.searchParams;
    var url = params.get("url");
    var domainkey = params.get("domainkey");

    block.innerHTML = `
        <form method="get" action="./lists">
            domainkey:
            <br>
            <input name="domainkey" value="` + domainkey + `">
            <br>
            hostname:
            <br>
            <input name="url" value="` + url + `">
            <br>
            <button type="submit">Go</button>
        </form>
    `;
}