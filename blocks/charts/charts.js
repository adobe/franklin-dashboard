import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { drawLoading } from '../../scripts/loading.js';
import { LineChart } from './lineChart.js';
import { BarChart } from './barCharts.js';

export default function decorate(block) {
  const params = new URLSearchParams(window.location.search);
  const perfRanges = {};

  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
  const typeChart = cfg.type;
  const endpoint = cfg.data;
  const tableColumn = cfg.field;
  if (Object.hasOwn(cfg, 'good') && Object.hasOwn(cfg, 'okay') && Object.hasOwn(cfg, 'poor')) {
    perfRanges[tableColumn] = {
      good: cfg.good.replace(' ', '').split(',').map((el) => parseFloat(el)),
      okay: cfg.okay.replace(' ', '').split(',').map((el) => parseFloat(el)),
      poor: cfg.poor.replace(' ', '').split(',').map((el) => parseFloat(el)),
    };
  }

  /* for next feature, make link to deep dive for a domain
  const homeLink = cfg['home-link'];
  const homeLinkLabelKey = cfg['home-link-label-key'];
  */
  const legend = cfg.label;
  const labelKey = cfg['label-key'];
  const chartId = `${[endpoint, tableColumn, typeChart].join('-')}`.toLowerCase(); // id is data row + chart type because why have this twice?
  const tableAndColumn = `${endpoint}-${tableColumn}`;
  if (!Object.hasOwn(window, 'chartCounter')) {
    window.chartCounter = 1;
  }
  block.parentElement.id = `chart${window.chartCounter}`;
  block.id = `chart${window.chartCounter}`;
  window.chartCounter += 1;

  cfg.block = block;
  cfg.chartId = chartId;
  cfg.perfRanges = perfRanges;

  // once we read config, clear the dom.
  block.querySelectorAll(':scope > div').forEach((row) => {
    row.style.display = 'none';
  });

  // draw the loading graphic
  const loading = document.createElement('div');
  loading.classList.add('loading', 'wide');
  block.appendChild(loading);
  drawLoading(loading);

  const currBlock = document.querySelector(`div#${block.id}.${block.className.split(' ').join('.')}`);
  // construct canvas where chart will sit
  const canvasWrapper = document.createElement('div');  
  canvasWrapper.style.height = '100%';
  canvasWrapper.style.width = '100%';
  canvasWrapper.id = chartId;
  currBlock.append(canvasWrapper);

  if(typeChart === 'line'){
    const lineChart = new LineChart(cfg);
    lineChart.drawChart();
  }
  else if(typeChart === 'bar'){
    const barChart = new BarChart(cfg);
    barChart.drawChart();
  }
}
