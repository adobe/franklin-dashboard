/**
 * This function chooses a script to inline based on the data being accessed via http request.
 * inlined script will contain data processing necessary for charts of that type to appear.
 * @param {*} data
 * @returns
 */
function engineerData(tableAndColumn, paramData, tableColumn, labelKey) {
  // tied to table name, column name, will determine how we handle data
    const utils = `
    function transformDataIntoMap(results){
      const transformed = {};
      const key = 'host';
      results.forEach((item) => {
          if(!(item[key] in transformed)){
              transformed[item[key]] = [item];
          }
          else if(item[key] in transformed){
              transformed[item[key]].push(item)
          }
      })
      return transformed;
    };

    function ymd2Date(year, month, day){
      return new Date(year, month, day);
    }

    function comparator(a,b){
      let lesser = ymd2Date(a.year, a.month, a.day) < ymd2Date(b.year, b.month, b.day);
      let greater = ymd2Date(a.year, a.month, a.day) < ymd2Date(b.year, b.month, b.day)
      if(lesser){
        return -1;
      }
      else if(greater){
        return 1;
      }
      else{
        return 0;
      }
    }`

  const commonPlots = `
    res = data.results.data;
    const dataSize = res.length;
    let windowPercentage = 0.05;
    let windowSize = windowPercentage * dataSize;
  
    while(windowSize > 10){
      windowPercentage -= 0.01;
      windowSize = windowPercentage * dataSize;
    }
  
    let start = 0;
    let end = windowPercentage * 100;
    const labels = res.map(row => row.${labelKey});
    const series = res.map(row => row.${tableColumn});`;

    const dashboardCommonPlots = `
    res = data.results.data;
    const labels = res.map(row => row.${labelKey}.replace('https://${paramData.get('url')}', '');
    const series = res.map(row => row.${tableColumn});
  `

  const pageviewsPlot = `
    ${utils}
    res = data.results.data;
    const dataSize = res.length;
    let tenPercent;
  
    if(dataSize !== 0){
      tenPercent = 50.0/dataSize
    }

    if(tenPercent >= 1){
      start = 0;
      end = 100;
    }
    else{
      start = (100 - (tenPercent * 100));
      end = 100;
    }
  
    const labels = res.sort(comparator).map(row => row.${labelKey}.slice(0, 10));
    const series = res.map(row => row.${tableColumn});
  `
  
  const skCommonPlot = `
  res = data.results.data;
  res = [...res].reverse();
  const labels = res.map(row => row.${labelKey});
  const series = res.map(row => row.${tableColumn});
  `;


  const cashubCommonPlot = `
    ${utils};
    res = transformDataIntoMap(data.results.data);
  
    let plotData;
    if(${paramData.has('url')} && Object.hasOwn(res, '${paramData.get('url')}')){
      plotData = res['${paramData.get('url')}'];
    }
  
    let labels = plotData.map(row => row.date);
    let series = plotData.map(row => row.${tableColumn} ${tableColumn === 'avglcp' ? ' > 6 ? 5.5 : row.avglcp' : ''});
  
    let currentUrl = plotData[0].host;
  
    let percentage = .50;
    let row = plotData[0];
    start = row.date;
    let amount = parseInt(plotData.length * percentage); 
    if(amount > 70){
      while(amount > 70){
        percentage = percentage - .05;
        amount = parseInt(plotData.length * percentage);
      }
      let row = plotData[plotData.length - amount];
      start = row.date;
    }`;

  /* ------------------------------------------------------------------------- */
  // ADD MORE INLINE JS THAT HANDLES DATA FOR A DIFFERENT TYPE OF CHART BELOW!

  const DATA_CONFIG = {
    // Franklin queries
    'rum-dashboard-avglcp': commonPlots,
    'rum-dashboard-avgfid': commonPlots,
    'rum-dashboard-avgcls': commonPlots,
    'rum-dashboard-pageviews': commonPlots,
    'rum-pageviews-pageviews': pageviewsPlot,
    'sk-daily-users-actions': skCommonPlot,
    'sk-daily-users-checkpoints': skCommonPlot,
    'sk-daily-users-extension_actions': skCommonPlot,
    // Vrapp queries
    'daily-rum-avglcp': cashubCommonPlot,
    'daily-rum-avgfid': cashubCommonPlot,
    'daily-rum-avgcls': cashubCommonPlot,
  };

  return DATA_CONFIG[tableAndColumn];
}

export default engineerData;
