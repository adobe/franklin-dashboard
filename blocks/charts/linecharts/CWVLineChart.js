import LineChart from './lineChart.js';

export default class PageviewsLineChart extends LineChart {
  drawChart() {
    if (typeof echarts === 'undefined') {
      window.setTimeout(this.drawChart.bind(this), 10);
    } else {
      const currBlock = document.querySelector(`div#${this.cfg.chartId}`);
      // eslint-disable-next-line no-undef
      this.echart = echarts.init(currBlock);
      this.extraDomOperations(currBlock);
      const endpoint = this.cfg.data;
      const flag = `${endpoint}Flag`;

      if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag)) {
        window.setTimeout(this.drawChart.bind(this), 10);
      } else if (Object.hasOwn(window, flag) && window[flag] === false) {
        // query complete, hide loading graphic
        this.data = window.dashboard[this.cfg.data].results.data;
        document.querySelectorAll('div.loading').forEach((loading) => {
          loading.style.display = 'none';
        });

        const reverseData = [...this.data].reverse();

        const labels = reverseData.map((row) => row[`${this.cfg['label-key']}`].substr(0, 10));
        const series = reverseData.map((row) => row[`${this.cfg.field}`]);
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
