import Chart from '../chartClass.js';

export default class BarChart extends Chart {
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

  transformData(callback = () => this.data) {
    if (typeof callback === 'function') {
      this.data = callback(this.data);
    }
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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
            extraCssText: 'width: fit-content; height: fit-content;',
          },
          legend: {
            data: [`${legend}`],
          },
          grid: {
            overflow: 'truncate',
          },
          xAxis: {
          },
          yAxis: {
            data: labels,
            axisLabel: {
              show: false,
            },
          },
          series: [
            {
              type: 'bar',
              data: series,
              label: {
                position: 'insideLeft',
                formatter: '{b}',
                show: true,
                color: '#000000',
              },
            },
          ],
        };
        this.configureEchart(opts);
        this.echart.setOption(opts);
        this.hideLoader(this.cfg.block);
      }
    }
  }
}
