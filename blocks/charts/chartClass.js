import { hideLoader } from '../../../scripts/loader.js';

export default class Chart {
  /* Member Data
     block: Object;
     echart: Object;
     options: Object;
     data: Object;
     chartId: string;
     cfg: Object;
     */

  constructor(cfg) {
    this.cfg = cfg;
  }

  setData(data) {
    this.data = data;
  }

  setEchart(echart) {
    this.echart = echart;
  }

  configureEchart(options) {
    this.options = options;
  }

  extraDomOperations(chartElement) {
    const canvasDiv = chartElement.querySelector('div');
    canvasDiv.style.height = '100%';
    canvasDiv.style.width = '100%';
    canvasDiv.style.margin = 'auto';

    new ResizeObserver(() => {
      this.echart.resize();
    }).observe(chartElement);
  }

  hideLoader(block){
    hideLoader(block);
  }

  drawChart() {
    if (typeof echarts === 'undefined') {
      window.setTimeout(this.drawChart.bind(this), 10);
    } else {
      const currBlock = document.querySelector(`div#${this.cfg.chartId}}`);
      // eslint-disable-next-line no-undef
      this.echart = echarts.init(currBlock);
      this.extraDomOperations(currBlock);
      if ((Object.hasOwn(window, 'dataIncoming') && window.dataIncoming === true) || !Object.hasOwn(window, 'dataIncoming')) {
        window.setTimeout(this.drawChart.bind(this), 30);
      } else if (Object.hasOwn(window, 'dataIncoming') && window.dataIncoming === false) {
        // query complete, hide loading graphic
        this.data = window.dashboard[this.cfg.data].results.data;
        document.querySelectorAll('div.loading').forEach((loading) => {
          loading.style.display = 'none';
        });

        const labels = this.data.map((row) => row[`${this.cfg['label-key']}`]);
        const series = this.data.map((row) => row[`${this.cfg.field}`]);
        const legend = this.cfg.label;

        const opts = {
          title: {
            text: `${legend}`,
            x: 'center',
          },
          xAxis: {
            type: 'category',
            triggerEvent: true,
            data: labels,
            axisLabel: {
              show: true,
              interval: 1,
              rotate: 70,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: series,
              type: 'line',
              smooth: true,
              symbol: 'none',
            },
          ],
        };
        this.configureEchart(opts);
        this.echart.setOption(opts);
      }
    }
  }
}
