import { readBlockConfig } from '../../scripts/lib-franklin.js';
import engineerData from './engineer-data.js';
import chartPicker from './chart-options.js';
import { postPlotDomEngineering, prePlotDomEngineering } from './engineer-dom.js';

export default function decorate(block) {
  const params = new URLSearchParams(window.location.search);

  const axisDict = {
    avgfid: [0, 500],
    avgcls: [0, 0.45],
    avglcp: [0, 6000],
  };

  const perfRanges = {
    avgfid: {
      good: [0, 100],
      okay: [100, 300],
      poor: [300],
    },
    avgcls: {
      good: [0, 0.1],
      okay: [0.1, 0.25],
      poor: [0.25],
    },
    avglcp: {
      good: [0, 2500],
      okay: [2500, 4000],
      poor: [4000],
    },
  };

  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
  const typeChart = cfg.type;
  const endpoint = cfg.data;
  const tableColumn = cfg.field;
  /* for next feature, make link to deep dive for a domain
  const homeLink = cfg['home-link'];
  const homeLinkLabelKey = cfg['home-link-label-key'];
  */
  const legend = cfg.label;
  const labelKey = cfg['label-key'];
  const chartId = `${[endpoint, tableColumn, typeChart].join('-')}`.toLowerCase(); // id is data row + chart type because why have this twice?
  const tableAndColumn = `${endpoint}-${tableColumn}`;

  let chartMin; //defaults
  let chartMax; //defaults
  
  if(Object.hasOwn(axisDict, tableColumn)){
    chartMin = axisDict[tableColumn][0];
    chartMax = axisDict[tableColumn][1];
  }

  // once we read config, clear the dom.
  block.querySelectorAll(':scope > div').forEach((row) => {
    row.remove();
  });
  const echartsScript = document.createElement('script');
  echartsScript.type = 'text/partytown';
  //echartsScript.src ='../../scripts/test.js'
  echartsScript.async = true;
  echartsScript.innerHTML = `
  (async function(){
    //data will live in this variable res
    let res;
    //request data
    function checkForData(){
      if((Object.hasOwn(window, 'dataIncoming') && window.dataIncoming === true) || !Object.hasOwn(window, 'dataIncoming')){
        window.setTimeout(checkForData, 10);
      }
      else if(Object.hasOwn(window, 'dataIncoming') && window.dataIncoming === false){
        const data = window.dashboard['${endpoint}'];
        //configure this chart and fill it with proper parameters
        ${prePlotDomEngineering(tableAndColumn, chartId, block)}
        ${engineerData(tableAndColumn, params, tableColumn, labelKey)}
        ${chartPicker(endpoint, typeChart, tableColumn, perfRanges, legend, chartMin, chartMax)}
        ${postPlotDomEngineering(tableAndColumn, chartId, params)}
        myChart.setOption(option);
      }
    }
    checkForData();
    })()
  `;

  block.append(echartsScript);
}
