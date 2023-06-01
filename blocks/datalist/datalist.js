import { readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the top pages block
 * @param {Element} block The top pages block element
 */
export default async function decorate(block) {
    // read block params
    const cfg = readBlockConfig(block);

    // draw list
    drawList(block, cfg);
}

export async function drawList(block, cfg) {
    // empty default content
    block.textContent = "";

    // prepare run-query params
    var params = new URL(window.location.href).searchParams;
    var url = params.get("url");
    var domainkey = params.get("domainkey");
    var startdate = new Date();
    startdate.setDate(startdate.getDate() - 30);
    startdate = startdate.toISOString().split('T')[0];
    var enddate = new Date();
    enddate = enddate.toISOString().split('T')[0];
    var limit = params.get("limit");
    if (!limit) {limit = 10};

    var runquery =
            cfg["runquery"]
            + "?domainkey=" + domainkey
            + "&url=" + url
            + "&interval=-1"
            + "&offset=-1"
            + "&startdate=" + startdate
            + "&enddate=" + enddate;

    // call query
    const response = await fetch(runquery);
    const jsonData = await response.json();

    // prepare DOM for list
    let container = document.createElement("div");
    container.className = "container-2col";

    let headerTitle = document.createElement("div");
    headerTitle.classList.add("header", "wide");
    headerTitle.textContent = cfg["title"];
    container.appendChild(headerTitle);

    let headerUrl = document.createElement("div");
    headerUrl.className = "header";
    headerUrl.textContent = cfg["col1name"];
    container.appendChild(headerUrl);

    let headerCount = document.createElement("div");
    headerCount.className = "header";
    headerCount.textContent = cfg["col2name"];
    container.appendChild(headerCount);

    block.appendChild(container);

    // add results data
    let i = 0;
    while (i < jsonData.results.data.length && i < parseInt(limit)) {
        // get data for specified columns
        let col1 = eval("jsonData.results.data[i]." + cfg["col1value"]);
        let col2 = eval("jsonData.results.data[i]." + cfg["col2value"]);
        
        // add rows, currently a two column grid
        let div1 = document.createElement("div");
        div1.textContent = col1;
        container.appendChild(div1);

        let div2 = document.createElement("div");
        div2.textContent = col2;
        container.appendChild(div2);

        i++;
    }
}