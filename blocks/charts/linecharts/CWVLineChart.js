import LineChart from './lineChart.js';

export default class CWVLineChart extends LineChart {
  drawChart() {
    if (typeof echarts === 'undefined') {
      window.setTimeout(this.drawChart.bind(this), 5);
    } else {
      const currBlock = document.querySelector(`div#${this.cfg.chartId}`);
      // eslint-disable-next-line no-undef
      this.echart = echarts.init(currBlock);
      this.extraDomOperations(currBlock);
      const endpoint = this.cfg.data;
      const poiEndpoint = this.cfg['poi-data'];
      const flag = `${endpoint}Flag`;
      const poiFlag = `${poiEndpoint}Flag`;

      if (((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag))
      || (poiEndpoint && ((Object.hasOwn(window, poiFlag) && window[poiFlag] === true)
    || !Object.hasOwn(window, poiFlag)))) {
        window.setTimeout(this.drawChart.bind(this), 5);
      } else if (Object.hasOwn(window, flag) && window[flag] === false) {
        // query complete, hide loading graphic
        this.data = window.dashboard[this.cfg.data].results.data;
        document.querySelectorAll('div.loading').forEach((loading) => {
          loading.style.display = 'none';
        });

        const labels = this.data.map((row) => row[`${this.cfg['label-key']}`].substr(0, 10));
        const series = this.data.map((row) => row[`${this.cfg.field}`]);
        const title = this.cfg.label;
        const params = new URLSearchParams(window.location.href);

        if (poiEndpoint && Object.hasOwn(window.dashboard, poiEndpoint) && this.data) {
          const poiMap = {};
          window.dashboard[poiEndpoint].results.data.forEach((val) => {
            /* eslint-disable camelcase */
            const {
              commit_date, commit_url, message, owner_repo,
            } = val;
            if (!Object.hasOwn(this, 'defaultKey')) {
              this.defaultKey = owner_repo;
            }
            if (!Object.hasOwn(poiMap, owner_repo)) {
              const map = {};
              poiMap[owner_repo] = map;
            }
            poiMap[owner_repo][commit_date] = { commit_url, message };
          });
          this.poi_data = poiMap;
        }

        const callback = (param) => {
          if (Object.keys(this.poi_data).length > 0
          && Object.hasOwn(this.poi_data[this.defaultKey], param.name)) {
            const { message, commit_url } = this.poi_data[this.defaultKey][param.name];
            return `${message || 'No Message Available'}<br />
            Commit Date: ${param.name}<br/>
            <a href="${commit_url}" target='_'>Click To See Commit </a><br />`;
          }
          return null;
        };

        const { good, okay } = this.cfg.perfRanges[this.cfg.field];

        const opts = {
          title: {
            text: `${title}\n${params.get('url')}`,
            x: 'center',
          },
          grid: {
            left: 30,
            right: 110,
            bottom: 30,
            containLabel: true,
          },
          toolbox: {
            feature: {
              dataZoom: {
                xAxisIndex: 'none',
              },
              restore: {},
              saveAsImage: {},
            },
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100,
            },
            {
              start: 0,
              end: 100,
            },
          ],
          tooltip: {
            enterable: true,
            trigger: 'item',
            formatter: callback,
            confine: true,
            extraCssText: 'width: fit-content; height: fit-content;',
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
              symbol: 'circle',
              symbolSize: (val, param) => {
                if (Object.keys(this.poi_data).length > 0
                && Object.hasOwn(this.poi_data[this.defaultKey], param.name)) {
                  return 15;
                }
                return 0;
              },
              markLine: {
                data: [
                  {
                    name: 'Good',
                    yAxis: `${good[1]}`,
                    lineStyle: {
                      width: 10,
                      normal: {
                        type: 'dashed',
                        color: 'green',
                      },
                    },
                    label: {
                      normal: {
                        position: 'end',
                        show: true,
                      },
                    },
                  },
                  {
                    name: 'Okay',
                    yAxis: `${okay[1]}`,
                    lineStyle: {
                      width: 10,
                      normal: {
                        type: 'dashed',
                        color: 'red',
                      },
                    },
                    label: {
                      normal: {
                        position: 'end',
                        show: true,
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
        this.hideLoader(this.cfg.block);
      }
    }
  }
}
