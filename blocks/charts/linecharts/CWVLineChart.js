import LineChart from './lineChart.js';

export default class CWVLineChart extends LineChart {
  drawChart() {
    if (typeof echarts === 'undefined') {
      window.setTimeout(this.drawChart.bind(this), 5);
    } else {
      const currBlock = document.querySelector(`div#${this.cfg.chartId}`);
      // eslint-disable-next-line no-undef
      this.echart = echarts.init(currBlock);
      if(!Object.hasOwn(window, 'chartGroup')){
        window.chartGroup = [];
      }
      this.echart.group = 'group1';
      window.chartGroup.push(this.echart);
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
          const info = param[0];
          if (Object.keys(this.poi_data).length > 0
          && Object.hasOwn(this.poi_data[this.defaultKey], info.axisValue)) {
            const { message, commit_url } = this.poi_data[this.defaultKey][info.axisValue];
            return `${this.cfg.field.toUpperCase()} Score: ${parseFloat(info.data).toFixed(2)}<br />
            ${message || 'No Message Available'}<br />
            Commit Date: ${info.axisValue}<br/>
            <a href="${commit_url}" target='_'>Click To See Commit </a><br />`;
          }
          return `${this.cfg.field.toUpperCase()} Score: ${parseFloat(info.data).toFixed(2)}<br />
          Date: ${info.axisValue}<br/>`
        };

        const { good, okay } = this.cfg.perfRanges[this.cfg.field];

        const opts = {
            title: {
              text: `${title}\n${params.get('url')}`,
              right: 0,
              x: 'center',
            },
            legend: {
              orient: 'horizontal',
              extraCssText: 'width: fit-content; height: fit-content;',
              top: '0',
              left: '0',
            },
          grid: {
            left: 30,
            right: 110,
            bottom: 30,
            containLabel: true,
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {},
            },
          },
          dataZoom: [
            {
              type: 'inside',
              show: false,
              start: 0,
              end: 100,
            },
          ],
          tooltip: {
            enterable: true,
            trigger: 'axis',
            triggerOn: 'click',
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
              smooth: false,
              symbol: 'circle',
              lineStyle: {
                color: `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`
              },
              symbolSize: (val, param) => {
                if (Object.keys(this.poi_data).length > 0
                && Object.hasOwn(this.poi_data[this.defaultKey], param.name)) {
                  return 15;
                }
                return 5;
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
              markArea: {
                data: [
                  [
                    {
                      name: 'Good',
                      yAxis: `${good[0]}`, // min of green area
                      itemStyle: {
                        color: 'rgba(221,255,221, 0.2)',
                      },
                    },
                    {
                      yAxis: `${good[1]}`, // max of green area area
                    },
                  ],
                  [
                    {
                      name: 'Needs Improvement',
                      yAxis: `${okay[0]}`, // min of green area
                      label: {
                        show: Math.max(series) >= okay[0] ? true : false,
                      },
                      itemStyle: {
                        color: 'rgba(256, 255, 256, 0.2)',
                      },
                    },
                    {
                      yAxis: `${okay[1]}`, // max of green area area
                    },
                  ],
                ],
              },
            },
          ],
        };
        this.configureEchart(opts);
        this.echart.setOption(opts);
        this.hideLoader(this.cfg.block);
        if(!Object.hasOwn(window, 'connected')){
          window.connected = 0;
          window.connected = window.connected + 1;
        }else{
          window.connected = window.connected + 1;
          if(window.connected === 4){
            echarts.connect('group1');
            echarts.connect(window.chartGroup);
          }
        }
      }
    }
  }
}
