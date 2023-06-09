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
 * @param {*} dataSize
 * @returns
 */
const chartPicker = (endpoint, typeChart, tableColumn, perfRanges, legend) => {
  const pick = `${endpoint}-${typeChart}`;
  let goodLower;
  let goodUpper;
  let okayUpper;
  let okayLower;
  if (Object.hasOwn(perfRanges, tableColumn)) {
    [goodLower, goodUpper] = perfRanges[tableColumn].good;
    [okayLower, okayUpper] = perfRanges[tableColumn].okay;
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
                  ${goodUpper ? `yAxis:${goodUpper},` : ''}
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
                  ${okayUpper ? `yAxis:${okayUpper},` : ''}
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

    /*-------------------------------*/
    'rum-pageviews-line': `{
      title: {
        text: '${legend}',
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
        type: 'value'
      },
      series: [
        {
          data: series,
          type: 'line',
          smooth: true,
          symbol: 'none',
        }
      ]
    };`,

    /*--------------------------------*/
    'rum-dashboard-bar-horizontal': `{
        title: {
          text: '${legend}',
          x: 'center',
        },
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: 0,
            zoomLock: false,
            left: 0,
            start: start,
            end: end,
            handleSize: 30,
          },
        ],  
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          extraCssText: 'width: fit-content; height: fit-content;'
        },
        legend: {
          data: ['${tableColumn}']
        },
        grid: {
          overflow: "truncate",
        },
        xAxis: {
        },
        yAxis: {
          data: labels,
          axisLabel: {
            show: false,
          }
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
                    xAxis: ${goodLower}, //min of green area
                    itemStyle: {
                      color: 'rgba(221,255,221, 0.5)'
                    },
                  },
                  {
                    xAxis: ${goodUpper}, //max of green area area
                  }
                ],
                [
                  {
                    name: 'Needs Improvement',
                    xAxis: ${okayLower}, //min of green area
                    itemStyle: {
                      color: 'rgba(256, 256, 256, 0.1)'
                    },
                  },
                  {
                    xAxis: ${okayUpper}, //max of green area area
                  }
                ],
              ]
            },
            markLine: {
              data: [
                {
                  name: 'Good',
                  ${goodUpper ? `xAxis:${goodUpper},` : ''}
                  lineStyle: {
                    width: 10,
                    normal: {
                      type:'dashed',
                      color: 'green',
                    }
                  },
                  label: {
                    normal: {
                    show: false, 
                    }
                  },
                },
                {
                  name: 'Okay',
                  ${okayUpper ? `xAxis:${okayUpper},` : ''}
                  lineStyle: {
                    width: 10,
                    normal: {
                      type:'dashed',
                      color: 'red',
                    }
                  },
                  label: {
                    normal: {
                    show: false, 
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

    'sk-daily-users-line': `{
        title: {
          text: '${legend}',
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
          type: 'value'
        },
        series: [
          {
            data: series,
            type: 'line',
            smooth: true,
            symbol: 'none',
          }
        ]
      };`,

  };
  return `var option = ${CHART_CONFIG[pick]}`;
};

export default chartPicker;
