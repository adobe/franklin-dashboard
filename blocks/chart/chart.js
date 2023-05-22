import { readBlockConfig } from "../../scripts/lib-franklin.js";
import { engineerData } from "./engineer-data.js";
import { chartPicker } from "./chart-options.js";
import { postPlotDomEngineering, prePlotDomEngineering } from "./engineer-dom.js";

export default function decorate(block) {
  const params = new URLSearchParams(window.location.search);
  const paramsObj = Array.from(params.keys()).reduce(
    (acc, val) => ({ ...acc, [val]: params.get(val) }),
    {},
  );
  const axisDict = {
    avgfid: [0, 500],
    avgcls: [0, 0.45],
    avglcp: [0, 6],
  };

  const perfRanges = {
    'avgfid': {
      'good': [0, 100],
      'okay': [100, 300],
      'poor': [300],
    },
    'avgcls': {
      'good': [0, 0.1],
      'okay': [0.1, 0.25],
      'poor': [0.25],
    },
    'avglcp': {
      'good': [0, 2.5],
      'okay': [2.5, 4.0],
      'poor': [4.0],
    }
  }

  const urlBase = {
    'daily-rum': 'https://lqmig3v5eb.execute-api.us-east-1.amazonaws.com/helix-services/run-query/ci5286/',
    'rum-dashboard': 'https://helix-pages.anywhere.run/helix-services/run-query@v3/',
    'rum-pageviews': 'https://helix-pages.anywhere.run/helix-services/run-query@v3/'
  }

  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
  const typeChart = cfg.type;
  const endpoint = cfg.data;
  const tableColumn = cfg.field;
  const homeLink = cfg['home-link'];
  const homeLinkLabelKey = cfg['home-link-label-key'];
  const legend = cfg.label;
  const labelKey = cfg['label-key'];
  const chartId = `${[endpoint, tableColumn, typeChart].join('-')}`.toLowerCase(); // id is data row + chart type because why have this twice?
  const tableAndColumn = `${endpoint}-${tableColumn}`;

  const paramData = new URLSearchParams();
  Object.entries(paramsObj).forEach(([param, val]) => {
    paramData.append(param, val);
  });

  const chartMin = axisDict[tableColumn][0];
  const chartMax = axisDict[tableColumn][1];

  const echartsScript = document.createElement('script');
  echartsScript.type = 'text/partytown';
  //echartsScript.src ='../../scripts/test.js'
  echartsScript.async = true;
  echartsScript.innerHTML = `
  (async function(){
    //data will live in this variable res
    let res;
    //request data
    const resp = await fetch('${urlBase[endpoint]}${endpoint}', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Cache-control': 'max-age=300',
          },
          body: '${paramData}'
      });
    const data = await resp.json();
    //configure this chart and fill it with proper parameters
    ${prePlotDomEngineering(tableAndColumn, chartId, block)}
    ${engineerData(tableAndColumn, paramData, tableColumn, labelKey)}
    ${chartPicker(endpoint, typeChart, tableColumn, perfRanges, legend, chartMin, chartMax)}
    ${postPlotDomEngineering(tableAndColumn, chartId, paramData)}
    myChart.setOption(option);
    })()
  `;

  block.append(echartsScript);
}