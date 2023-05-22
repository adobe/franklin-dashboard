/**
 * This function chooses a script to inline based on the data being accessed via http request.
 * inlined script will contain data processing necessary for charts of that type to appear.
 * @param {*} data 
 * @returns 
 */
export function engineerData(tableAndColumn, paramData, tableColumn, labelKey){
    //tied to table name, column name, will determine how we handle data
    const commonPlots = `
    res = data.results.data;
    const labels = res.map(row => row.${labelKey});
    const series = res.map(row => row.${tableColumn});`
  
    const cashubCommonPlot = `
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
    }
  
    function numDaysBetween(d1, d2) {
      var diff = Math.abs(d1.getTime() - d2.getTime());
      return diff / (1000 * 60 * 60 * 24);
    };
  
    function ymd2Date(year, month, day){
        return new Date(year, month, day);
    }
    res = transformDataIntoMap(data.results.data);
  
    let plotData;
    if(${paramData.has('url')} && ('${paramData.get('url')}' in res)){
      plotData = res['${paramData.get('url')}'];
    }else{
      Object.keys(res).forEach((k) => {
        if(!plotData && res[k].length >= 30){
          plotData = res[k];
        }
      });
    }
    plotData.sort(function(a,b){
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
    });
  
    let labels = plotData.map(row => [row.month, row.day, row.year%2000].join('-'));
    let series = plotData.map(row => row.${tableColumn} ${tableColumn === 'avglcp' ? ' > 6 ? 5.5 : row.avglcp' : ''});
  
    let currentUrl = plotData[0].host;
  
    let percentage = .50;
    let row = plotData[0];
    start = [row.month, row.day, row.year%2000].join('-');
    let amount = parseInt(plotData.length * percentage); 
    if(amount > 70){
      while(amount > 70){
        percentage = percentage - .05;
        amount = parseInt(plotData.length * percentage);
      }
      let row = plotData[plotData.length - amount];
      start = [row.month, row.day, row.year%2000].join('-');
    }`
  
    /* ------------------------------------------------------------------------- */
    //ADD MORE INLINE JS THAT HANDLES DATA FOR A DIFFERENT TYPE OF CHART BELOW!
  
    const DATA_CONFIG = {
      //Franklin queries
      'rum-dashboard-avglcp': commonPlots,
      'rum-dashboard-avgfid': commonPlots,
      'rum-dashboard-avgcls': commonPlots,
      //Vrapp queries
      'daily-rum-avglcp': cashubCommonPlot,
      'daily-rum-avgfid': cashubCommonPlot,
      'daily-rum-avgcls': cashubCommonPlot,
    }
  
  
    return DATA_CONFIG[tableAndColumn];
  }