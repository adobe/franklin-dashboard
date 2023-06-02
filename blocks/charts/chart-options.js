/**
 * This function chooses the chart option based on the endpoint and tablecolumn!
 * Each possible table/column must have a chart config as these are different types
 * of data that mandate different types of displays
 * @param {*} typeChart
 * @param {*} tableColumn
 * @param {*} perfRanges
 * @param {*} legend
 * @param {*} min
 * @param {*} max
 * @returns
 */
const chartPicker = (endpoint, typeChart, tableColumn, perfRanges, legend, min, max) => {
  const pick = `${endpoint}-${typeChart}`;
  let goodLower;
  let goodUpper;
  let okayUpper;
  let okayLower;
  let badLower;
  if(Object.hasOwn(perfRanges, tableColumn)){
    goodLower = perfRanges[tableColumn].good[0];
    goodUpper = perfRanges[tableColumn].good[1];
    okayLower = perfRanges[tableColumn].okay[0];
    okayUpper = perfRanges[tableColumn].okay[1];
    badLower = perfRanges[tableColumn].poor[0];
  }
  const CHART_CONFIG = {
    'daily-rum-line': `{
        title: {
        text: currentUrl + ' ${legend}',
        x: 'center',
        top: 15,
        },
        xAxis: {
          data: labels,
          type: 'category',
        },
        dataZoom: [
          {
              id: 'dataZoomX',
              type: 'slider',
              startValue: start,
              filterMode: 'filter'
          }
        ],
        yAxis: {
          min: ${min},
          max: ${max},
        },
        series: [
          {
            name: '${tableColumn}',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: series,
            markArea: {
              data: [
                [
                  {
                    name: 'Good',
                    yAxis: ${goodLower}, //min of green area
                    itemStyle: {
                      color: 'rgba(256, 256, 256, 0.1)'
                    },
                  },
                  {
                    yAxis: ${goodUpper}, //max of green area area
                  }
                ],
                [
                  {
                    name: 'Needs Improvement',
                    yAxis: ${okayLower}, //min of green area
                    itemStyle: {
                      color: 'rgba(256, 256, 256, 0.1)'
                    },
                  },
                  {
                    yAxis: ${okayUpper}, //max of green area area
                  }
                ],
              ]
            },
            markLine: {
              data: [
                {
                  name: 'Good',
                  ${goodUpper ? `yAxis:` + goodUpper +`,` : ``}
                  label: {
                    normal: {
                    show: true, 
                    }
                  },
                  lineStyle: {
                    width: 10,
                    normal: {
                      type:'solid',
                      color: 'green',
                    }
                  },
                },
                {
                  name: 'Okay',
                  ${okayUpper ? `yAxis:` + okayUpper+`,` : ``}
                  label: {
                    normal: {
                    show: true, 
                    }
                  },
                  lineStyle: {
                    width: 10,
                    normal: {
                      type:'solid',
                      color: 'red',
                    }
                  },
                },
              ],
              areaStyle: {
                color: '#91cc75'
              }
            },
          }
        ]
      };`,
    'rum-pageviews-line': `{
      xAxis: {
        type: 'category',
        data: labels
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: series,
          type: 'line'
        }
      ]
    };`,
    'rum-dashboard-bar-horizontal': `{
        title: {
          text: '${legend}',
          x: 'center',
        },
        tooltip: {},
        legend: {
          data: ['${tableColumn}']
        },
        grid: {
          containLabel: true,
        },
        xAxis: {
        },
        yAxis: {
          data: labels,
          triggerEvent: true,
        },
        series: [
          {
            type: 'bar',
            data: series,
          }
        ]
      };`,
  };
  return `var option = ${CHART_CONFIG[pick]}`;
};

export default chartPicker;
