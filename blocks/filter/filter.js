import { readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * Loads and decorates the filter block
 * @param {Element} block The filter block element
 */
export default function decorate(block) {
  // retrieve block config
  let cfg = readBlockConfig(block);
  //cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));

  // draw the form
  drawFilter(block, cfg);

  // set button onclick events
  // interval buttons
  document.getElementById('int7').addEventListener('click', () => {
    changeInterval('7', '0', '', '');
  });
  document.getElementById('int30').addEventListener('click', () => {
    changeInterval('30', '0', '', '');
  });
  document.getElementById('int90').addEventListener('click', () => {
    changeInterval('90', '0', '', '');
  });
  document.getElementById('intcustom').addEventListener('click', () => {
    changeInterval('-1', '-1', '', '');
  });

  // custom date button
  document.getElementById('btndatefilter').addEventListener('click', () => {
    if (checkDates()) {
      // should always be true because button hidden when dates invalid
      document.getElementById('filter').submit();
    }
  });

  // limit buttons
  document.getElementById('limit10').addEventListener('click', () => {
    changeLimit('10');
  });
  document.getElementById('limit30').addEventListener('click', () => {
    changeLimit('30');
  });
  document.getElementById('limit100').addEventListener('click', () => {
    changeLimit('100');
  });

  // show buttons when input field values change
  document.getElementById('url').addEventListener('change', () => {
    show('urlfilter', true);
  });
  document.getElementById('startdate').addEventListener('change', () => {
    checkDates();
  });
  document.getElementById('enddate').addEventListener('change', () => {
    checkDates();
  });

  // handle focus and blur styling
  document.getElementById('url').addEventListener('focus', () => {
    focus('url', true);
  });
  document.getElementById('startdate').addEventListener('focus', () => {
    focus('startdate', true);
  });
  document.getElementById('enddate').addEventListener('focus', () => {
    focus('enddate', true);
  });
  document.getElementById('url').addEventListener('blur', () => {
    focus('url', false);
  });
  document.getElementById('startdate').addEventListener('blur', () => {
    focus('startdate', false);
  });
  document.getElementById('enddate').addEventListener('blur', () => {
    focus('enddate', false);
  });
}

/**
 * Render the form fields in the filter block
 * @param {Element} block The block where output will be rendered
 * @param {Map} cfg Map containing config params
 */
function drawFilter(block, cfg) {
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

  // if block config param for sections exists
  // then show only the sections requested
  let sections = cfg["sections"];
  let securl = "";
  let secdate = "";
  let seclimit = "";
  if (sections !== null) {
    if (sections.toLowerCase().indexOf("url")==-1) {
      securl = "hide";
    }
    if (sections.toLowerCase().indexOf("date")==-1) {
      secdate = "hide";
    }
    if (sections.toLowerCase().indexOf("limit")==-1) {
      seclimit = "hide";
    }
  }
 
  // prepare filter form
  // TODO conditionally include sections of form based on block config
  let formHTML = `
    <form id=filter method=get action="` + currentpagenoqs + `">
      <input type=hidden name=domainkey value="` + domainkey + `">
      <input type=hidden id=interval name=interval value="` + interval + `">
      <input type=hidden id=offset name=offset value="` + offset + `">
      <input type=hidden id=limit name=limit value="` + limit + `">

      <div id=customurl class="customurl `+ securl + `">
        <div>
          <label for=url>URL</label>
          <input id=url name=url class=noedit value="` + url + `">
        </div>
        <div id=urlfilter class=" hide">
          <button id=btnurl>Go</button>
        </div>
      </div>
      <div id=dateinterval class="center wide `+ secdate + `">
        <button id=int7 class="` + int7 + `">Last 7 days</button>
        <button id=int30 class="` + int30 + `">Last 30 days</button>
        <button id=int90 class="` + int90 + `">Last 90 days</button>
        <button type=button id=intcustom class="` + intCustom + `">Custom</button>
      </div>
      <div id=customdate class="customdate wide ` + customDate + `  ` + secdate + `">
        <div>
          <label for=startdate>Start Date</label>
          <input type=date id=startdate name=startdate class=noedit
              min="2020-01-01" max="` + today + `"
              value="` + startdate + `">
        </div>
        <div>
          <label for=enddate>End Date</label>
          <input type=date id=enddate name=enddate class=noedit
              min="2020-01-01" max="` + today + `"
              value="` + enddate + `">
        </div>
        <div id=dateerror class="error center hide">
        </div>
        <div id=datefilter class="center hide">
          <button type=button id=btndatefilter>Filter by Date</button>
        </div>
      </div>
      <div id=limit class="center ` + seclimit + `">
        <button id=limit10 class="` + limit10 + `">Show 10</button>
        <button id=limit30 class="` + limit30 + `">Show 30</button>
        <button id=limit100 class="` + limit100 + `">Show 100</button>
      </div>
    </form>
  `;

  // draw filter form
  block.innerHTML = formHTML;
}

/**
 * Display or hide element based on a field value change
 * @param {string} element id of element to show
 * @param {boolean} show true when show, false when hide
 */
function show(element, show) {
  if (show) {
    // make input look editable
    document.getElementById(element).classList.remove('hide');
  } else {
    // make input look not editable
    document.getElementById(element).classList.add('hide');
  }
}

/**
 * Style input field -- by default inputs do not look like editable fields
 * @param {string} input id of field to style
 * @param {boolean} focus true when focus, false when blur
 */
function focus(input, focus) {
  if (focus) {
    // make input look editable
    document.getElementById(input).classList.remove('noedit');
  } else {
    // make input look not editable
    document.getElementById(input).classList.add('noedit');
  }
}

/**
 * Updates form field values and element displays related to date
 * @param {string} interval interval for run-query
 * @param {string} offset offset for run-query
 * @param {string} startdate startdate for run-query
 * @param {string} enddate enddate for run-query
 */
function changeInterval(interval, offset, startdate, enddate) {
  // update input fields and display as appropriate based on inputs
  if (interval!=-1) {
    // interval selected
    document.getElementById('customdate').classList.add('hide');
    document.getElementById('interval').value = interval;
    document.getElementById('offset').value = offset;
    document.getElementById('startdate').value = startdate;
    document.getElementById('enddate').value = enddate;

  } else {
    // custom date range entered
    // do not change interval and offset values until
    // valid dates entered in checkDates() function

    // adjust button highlights
    document.getElementById('int7').classList.remove('selected');
    document.getElementById('int30').classList.remove('selected');
    document.getElementById('int90').classList.remove('selected');
    document.getElementById('intcustom').classList.add('selected');

    // show startdate and enddate fields
    document.getElementById('customdate').classList.remove('hide');
  }
}

/**
 * Updates form field value
 * @param {string} limit limit used for other blocks on page
 */
function changeLimit(limit) {
  document.getElementById('limit').value = limit;
}

/**
 * Validate start and end date
 * @returns {boolean} true when dates are valid, false when invalid
 */
function checkDates() {
  let valid = true;
  let startdate = document.getElementById('startdate').value;
  let enddate = document.getElementById('enddate').value;
  let dateerror = document.getElementById('dateerror');
  console.log("checking dates");
  
  if (startdate=='' || enddate=='') {
    valid = false;
    show('datefilter', false);
    dateerror.textContent = 'Start Date and End Date are both required.';
    show('dateerror', true);
  } else if (new Date(startdate) > new Date(enddate)) {
    valid = false;
    show('datefilter', false);
    dateerror.textContent = 'Start Date must be earlier than End Date.';
    show('dateerror', true);
  }
  console.log("dates are valid: " + valid);

  if (valid) {
    // any button which submits form can be used
    document.getElementById('btnurl').classList.remove('disabled');
    document.getElementById('limit10').classList.remove('disabled');
    document.getElementById('limit30').classList.remove('disabled');
    document.getElementById('limit100').classList.remove('disabled');
    document.getElementById('btnurl').disabled = false;
    document.getElementById('limit10').disabled = false;
    document.getElementById('limit30').disabled = false;
    document.getElementById('limit100').disabled = false;
    show('dateerror', false);
    show('datefilter', true);
    document.getElementById('interval').value = "-1";
    document.getElementById('offset').value = "-1";
  } else {
    // do not allow any button to submit a form if dates are invalid
    // note the interval buttons remain enabled because they ignore dates
    document.getElementById('btnurl').classList.add('disabled');
    document.getElementById('limit10').classList.add('disabled');
    document.getElementById('limit30').classList.add('disabled');
    document.getElementById('limit100').classList.add('disabled');
    document.getElementById('btnurl').disabled = true;
    document.getElementById('limit10').disabled = true;
    document.getElementById('limit30').disabled = true;
    document.getElementById('limit100').disabled = true;
    show('datefilter', false);
    show('dateerror', true);
  }
  console.log("drew fields");

  return valid;
}
