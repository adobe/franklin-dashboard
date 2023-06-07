import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { drawLoading, hideLoading } from '../../scripts/loading.js';

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

    // prepare DOM for list
    let container = document.createElement("div");
    container.className = "container-2col";
    block.appendChild(container);

    let headerTitle = document.createElement("div");
    headerTitle.classList.add("title", "wide");
    headerTitle.textContent = cfg["title"];
    container.appendChild(headerTitle);

    // draw the loading graphic
    let loading = document.createElement("div");
    loading.classList.add("loading", "wide");
    container.appendChild(loading);
    drawLoading(loading);

    // prepare run-query params
    let currentpage = new URL(window.location.href);
    let params = currentpage.searchParams;
    let url = params.get("url");
    let domainkey = params.get("domainkey");
    let interval = params.get("interval");
    let offset = params.get("offset");
    let startdate = params.get("startdate");
    let enddate = params.get("enddate");
    let limit = params.get("limit");

    // set defaults
    if (interval == null) {
        interval = '30';
    }
    if (offset == null) {
        offset = '0';
    }
    if (startdate == null) {
        startdate = '';
    }
    if (enddate == null) {
        enddate = '';
    }
    if (limit == null) {
        limit = '10';
    }
    if (startdate!='') {
        interval = '-1';
        offset = '-1';
    }

    var runquery =
            cfg["runquery"]
            + "?domainkey=" + domainkey
            + "&url=" + url
            + "&interval=" + interval
            + "&offset=" + offset
            + "&startdate=" + startdate
            + "&enddate=" + enddate;

    // call query
    const response = await fetch(runquery);
    const jsonData = await response.json();

    // query complete, hide loading graphic
    hideLoading(loading);

    // column headers
    let headerUrl = document.createElement("div");
    headerUrl.className = "header";
    headerUrl.textContent = cfg["col1name"];
    container.appendChild(headerUrl);

    let headerCount = document.createElement("div");
    headerCount.className = "header";
    headerCount.textContent = cfg["col2name"];
    container.appendChild(headerCount);

    // add results data
    let i = 0;
    while (i < jsonData.results.data.length && i < parseInt(limit)) {
        // get data for specified columns
        let col1 = eval("jsonData.results.data[i]." + cfg["col1value"]);
        let col2 = eval("jsonData.results.data[i]." + cfg["col2value"]);
        
        // add rows, currently a two column grid
        let div1 = document.createElement("div");
        if ((i % 2) == 1) {
            div1.className = "odd";
        }
        div1.textContent = col1;
        container.appendChild(div1);

        let div2 = document.createElement("div");
        if ((i % 2) == 1) {
            div2.className = "odd";
        }
        div2.textContent = col2;
        container.appendChild(div2);

        i++;
    }
}