import Chart from '../chartClass.js';

export default class LineChart extends Chart {
  constructor(cfg) {
    super(cfg);
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
    super.extraDomOperations(chartElement);
  }

  drawChart() {
    if (typeof echarts === 'undefined') {
      window.setTimeout(this.drawChart.bind(this), 5);
    } else {
      const currBlock = document.querySelector(`div#${this.cfg.chartId}`);
      // eslint-disable-next-line no-undef
      this.echart = echarts.init(currBlock);
      this.extraDomOperations(currBlock);
      const endpoint = this.cfg.data;
      const flag = `${endpoint}Flag`;

      if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
        window.setTimeout(this.drawChart.bind(this), 5);
      } else if (Object.hasOwn(window, flag) && window[flag] === false) {
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
