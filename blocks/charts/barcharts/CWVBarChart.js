import BarChart from './barCharts.js';

export default class CWVBarChart extends BarChart {
  parseChartRanges() {
    let goodUpper;
    let goodLower;
    let okayLower;
    let okayUpper;

    const { perfRanges } = this.cfg;

    if (Object.hasOwn(perfRanges, this.cfg.field) && Object.hasOwn(perfRanges[this.cfg.field], 'good') && Object.hasOwn(perfRanges[this.cfg.field], 'okay') && Object.hasOwn(perfRanges[this.cfg.field], 'poor')) {
      [goodLower, goodUpper] = perfRanges[this.cfg.field].good;
      [okayLower, okayUpper] = perfRanges[this.cfg.field].okay;
    } else {
      [goodLower, goodUpper] = ['', ''];
      [okayLower, okayUpper] = ['', ''];
    }

    return [goodLower, goodUpper, okayLower, okayUpper];
  }

  getSliderStartAndEnd(maxWindowSize) {
    const dataSize = this.data.length;
    let windowPercentage = 0.05;
    let windowSize = windowPercentage * dataSize;

    while (windowSize > maxWindowSize) {
      windowPercentage -= 0.01;
      windowSize = windowPercentage * dataSize;
    }

    const start = 0;
    const end = windowPercentage * 100;

    return [start, end];
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

        const [goodLower, goodUpper, okayLower, okayUpper] = this.parseChartRanges();
        const [start, end] = this.getSliderStartAndEnd(15);

        const opts = {
          title: {
            text: `${legend}`,
            x: 'center',
          },
          dataZoom: [
            {
              type: 'slider',
              yAxisIndex: 0,
              zoomLock: false,
              left: 0,
              start,
              end,
              handleSize: 30,
            },
          ],
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
              markArea: {
                data: [
                  [
                    {
                      name: 'Good',
                      xAxis: `${goodLower}`, // min of green area
                      itemStyle: {
                        color: 'rgba(221,255,221, 0.5)',
                      },
                    },
                    {
                      xAxis: `${goodUpper}`, // max of green area area
                    },
                  ],
                  [
                    {
                      name: 'Needs Improvement',
                      xAxis: `${okayLower}`, // min of green area
                      itemStyle: {
                        color: 'rgba(256, 256, 256, 0.1)',
                      },
                    },
                    {
                      xAxis: `${okayUpper}`, // max of green area area
                    },
                  ],
                ],
              },
              markLine: {
                data: [
                  {
                    name: 'Good',
                    xAxis: `${goodUpper}`,
                    lineStyle: {
                      width: 10,
                      normal: {
                        type: 'dashed',
                        color: 'green',
                      },
                    },
                    label: {
                      normal: {
                        show: false,
                      },
                    },
                  },
                  {
                    name: 'Okay',
                    xAxis: `${okayUpper}`,
                    lineStyle: {
                      width: 10,
                      normal: {
                        type: 'dashed',
                        color: 'red',
                      },
                    },
                    label: {
                      normal: {
                        show: false,
                      },
                    },
                  },
                ],
                areaStyle: {
                  color: '#91cc75',
                },
              },
            },
          ],
        };
        this.configureEchart(opts);
        this.echart.setOption(opts);
      }
    }
  }
}
