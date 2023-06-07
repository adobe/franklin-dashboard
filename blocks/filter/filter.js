import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const params = new URLSearchParams(window.location.search);

  // TODO - change block config to allow type values like:
  // url,date,limit
  // url,date
  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));

  const type = cfg.type;

  // TODO - move these two functions to runtime execution

    function checkDates(start, end){
      if(new Date(start) > new Date(end)){
        throw new Error('Start Date is Greater than End Date')
      }
    }

    function processDateInput(){
        const start = document.querySelector('input#startdate');
        const end = document.querySelector('input#enddate');
        const url = document.querySelector('input#url_input');

        checkDates(start.value, end.value);

        params.set('startdate', start.value);
        params.set('enddate', end.value);
        type === 'date' ? params.set('url', url.value) : params.set('owner_repo', url.value)
        let loc = (document.location.origin + document.location.pathname + '?' + params.toString());
        window.location.href = loc;
        console.log('executed');
    }

  drawFilter(block, cfg);
}

export async function drawFilter(block, cfg) {
  // empty default content
  block.textContent = "";

  // retrieve querystring params for default filter values
  let currentpage = new URL(window.location.href);
  let currentpagenoqs = location.href.replace(location.search, '');
  let params = currentpage.searchParams;
  let url = params.get("url");
  let domainkey = params.get("domainkey");
  let interval = params.get("interval");
  let offset = params.get("offset");
  let startdate = params.get("startdate");
  let enddate = params.get("enddate");
  let limit = params.get("limit");

  // set defaults
  if (interval == null) {
    interval = '30';
  }
  if (offset == null) {
    offset = '0';
  }
  if (startdate == null) {
    startdate = '';
  }
  if (enddate == null) {
    enddate = '';
  }
  if (limit == null) {
    limit = '10';
  }
  if (startdate!='') {
    interval = '-1';
    offset = '-1';
  }
  
  // prepare variables to draw filter form
  let int7 = interval==7 ? "selected" : "";
  let int30 = interval==30 ? "selected" : "";
  let int90 = interval==90 ? "selected" : "";
  let intCustom = !int7 && !int30 && !int90 ? "selected" : "";
  let customDate = intCustom!="selected" ? "hide" : "";
  let limit10 = limit==10 ? "selected" : "";
  let limit30 = limit==30 ? "selected" : "";
  let limit100 = limit==100 ? "selected" : "";
  let today = new Date().toISOString().split('T')[0];
 
  // define javascript functions
  const script = document.createElement('script');
  script.innerHTML = `
    function changeInterval(interval, offset, startdate, enddate, submit) {

      if (interval!=-1) {
        // interval selected
        document.getElementById('customdate').classList.add('hide');
        document.getElementById('interval').value = interval;
        document.getElementById('offset').value = offset;
        document.getElementById('startdate').value = startdate;
        document.getElementById('enddate').value = enddate;

      } else {
        // custom date range entered
        document.getElementById('interval').value = "-1";
        document.getElementById('offset').value = "-1";

        // adjust button highlights
        document.getElementById('int7').classList.remove('selected');
        document.getElementById('int30').classList.remove('selected');
        document.getElementById('int90').classList.remove('selected');
        document.getElementById('intcustom').classList.add('selected');

        // show startdate and enddate fields
        document.getElementById('customdate').classList.remove('hide');

      }

      // true = submit form, false = do not submit form
      return submit;
    }

    function changeLimit(limit) {
      // update input field
      document.getElementById('limit').value = limit;

      // submit form
      return true;
    }
  `;
  document.head.appendChild(script);

  // draw filter form
  block.innerHTML = `
    <form id=filter method=get action="` + currentpagenoqs + `">
      <input type=hidden name=domainkey value="` + domainkey + `">
      <input type=hidden id=interval name=interval value="` + interval + `">
      <input type=hidden id=offset name=offset value="` + offset + `">
      <input type=hidden id=limit name=limit value="` + limit + `">

      <div class="customurl">
        <div>
          <label for=url>URL</label>
          <input id=url name=url class=noedit value="` + url + `"
              onfocus="this.classList.remove('noedit');"
              onblur="this.classList.add('noedit');"
              onchange="document.getElementById('urlfilter').classList.remove('hide');"
              >
        </div>
        <div id=urlfilter class=" hide">
          <button>Go</button>
        </div>
      </div>
      <div class="center wide">
        <button id=int7 class="` + int7 + `"
            onclick="return changeInterval('7', '0', '', '', true);"
            >Last 7 days</button>
        <button id=int30 class="` + int30 + `"
            onclick="return changeInterval('30', '0', '', '', true);"
            >Last 30 days</button>
        <button id=int90 class="` + int90 + `"
            onclick="return changeInterval('90', '0', '', '', true);"
            >Last 90 days</button>
        <button id=intcustom class="` + intCustom + `"
            onclick="return changeInterval('-1', '-1', '', '', false);"
            >Custom</button>
      </div>
      <div id=customdate class="customdate wide ` + customDate + `">
        <div>
          <label for=startdate>Start Date</label>
          <input type=date id=startdate name=startdate class=noedit
              min="2020-01-01" max="` + today + `"
              value="` + startdate + `"
              onfocus="this.classList.remove('noedit');"
              onblur="this.classList.add('noedit');"
              onchange="document.getElementById('datefilter').classList.remove('hide');"
              >
        </div>
        <div>
          <label for=enddate>End Date</label>
          <input type=date id=enddate name=enddate class=noedit
              min="2020-01-01" max="` + today + `"
              value="` + enddate + `"
              onfocus="this.classList.remove('noedit');"
              onblur="this.classList.add('noedit');"
              onchange="document.getElementById('datefilter').classList.remove('hide');"
              >
        </div>
        <div id=datefilter class="center hide">
          <button
              onclick="changeInterval('-1', '-1', document.getElementById('startdate').value, document.getElementById('enddate').value, true);"
              >Filter by Date</button>
        </div>
      </div>
      <div class=center>
        <button id=limit10 class="` + limit10 + `"
            onclick="return changeLimit('10');"
            >Show 10</button>
        <button id=limit30 class="` + limit30 + `"
            onclick="return changeLimit('30');"
            >Show 30</button>
        <button id=limit100 class="` + limit100 + `"
            onclick="return changeLimit('100');"
            >Show 100</button>
      </div>
    </form>
  `;

}
