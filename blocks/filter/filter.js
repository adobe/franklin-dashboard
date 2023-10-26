import { readBlockConfig } from '../../scripts/lib-franklin.js';

// TODO replace getElementById with querySelector

/**
 * Display or hide element based on a field value change
 * @param {string} element id of element to show
 * @param {boolean} display true when show, false when hide
 */
function show(element, display) {
  if (display) {
    // show element
    document.getElementById(element).classList.remove('hide');
  } else {
    // hide element
    document.getElementById(element).classList.add('hide');
  }
}

/**
 * Style input field -- by default inputs do not look like editable fields
 * @param {string} input id of field to style
 * @param {boolean} editable true when focus, false when blur
 */
function focus(input, editable) {
  if (editable) {
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
  if (interval !== '-1') {
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
  const startdate = document.getElementById('startdate').value;
  const enddate = document.getElementById('enddate').value;
  const dateerror = document.getElementById('dateerror');

  if (startdate === '' || enddate === '') {
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

  if (valid) {
    // any button which submits form can be used
    document.getElementById('btnurl').classList.remove('disabled');
    document.getElementById('btnownerrepo').classList.remove('disabled');
    document.getElementById('limit10').classList.remove('disabled');
    document.getElementById('limit30').classList.remove('disabled');
    document.getElementById('limit100').classList.remove('disabled');
    document.getElementById('btnurl').disabled = false;
    document.getElementById('btnownerrepo').disabled = false;
    document.getElementById('limit10').disabled = false;
    document.getElementById('limit30').disabled = false;
    document.getElementById('limit100').disabled = false;
    show('dateerror', false);
    show('datefilter', true);
    document.getElementById('interval').value = '-1';
    document.getElementById('offset').value = '-1';
  } else {
    // do not allow any button to submit a form if dates are invalid
    // note the interval buttons remain enabled because they ignore dates
    document.getElementById('btnurl').classList.add('disabled');
    document.getElementById('btnownerrepo').classList.add('disabled');
    document.getElementById('limit10').classList.add('disabled');
    document.getElementById('limit30').classList.add('disabled');
    document.getElementById('limit100').classList.add('disabled');
    document.getElementById('btnurl').disabled = true;
    document.getElementById('btnownerrepo').disabled = true;
    document.getElementById('limit10').disabled = true;
    document.getElementById('limit30').disabled = true;
    document.getElementById('limit100').disabled = true;
    show('datefilter', false);
    show('dateerror', true);
  }

  return valid;
}

/**
 * Render the form fields in the filter block
 * @param {Element} block The block where output will be rendered
 * @param {Object} cfg Map containing config params
 */
function drawFilter(block, cfg) {
  // TODO determine if below is best approach
  // draw placeholder "hero" for LCP purposes
  block.innerHTML = '<form></form>';

  // retrieve querystring params for default filter values
  const currentpage = new URL(window.location.href);
  const currentpagenoqs = window.location.href.replace(window.location.search, '');
  const params = currentpage.searchParams;
  // set defaults as needed
  const url = params.get('url') || '';
  const ownerrepo = params.get('owner_repo') || '';
  const domainkey = params.get('domainkey');
  let interval = params.get('interval') || '30';
  let offset = params.get('offset') || '0';
  const startdate = params.get('startdate') || '';
  const enddate = params.get('enddate') || '';
  const limit = params.get('limit') || '10';
  const exactmatch = params.get('exactmatch') || 'false';

  if (startdate !== '') {
    interval = '-1';
    offset = '-1';
  }

  // prepare variables to draw filter form
  const int7 = interval === '7' ? 'selected' : '';
  const int30 = interval === '30' ? 'selected' : '';
  const int90 = interval === '90' ? 'selected' : '';
  const intCustom = !int7 && !int30 && !int90 ? 'selected' : '';
  const customDate = intCustom !== 'selected' ? 'hide' : '';
  const limit10 = limit === '10' ? 'selected' : '';
  const limit30 = limit === '30' ? 'selected' : '';
  const limit100 = limit === '100' ? 'selected' : '';
  const today = new Date(); // get today's date
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const maxStartDate = today.toISOString().split('T')[0];
  const maxEndDate = tomorrow.toISOString().split('T')[0];

  // if block config param for sections exists
  // then show only the sections requested
  // eslint-disable-next-line prefer-destructuring
  const sections = cfg.sections;
  let securl = '';
  let secownerrepo = '';
  let secdate = '';
  let seclimit = '';
  if (sections !== null) {
    if (sections.toLowerCase().indexOf('url') === -1) {
      securl = 'hide';
    }
    if (sections.toLowerCase().indexOf('ownerrepo') === -1) {
      secownerrepo = 'hide';
    }
    if (sections.toLowerCase().indexOf('date') === -1) {
      secdate = 'hide';
    }
    if (sections.toLowerCase().indexOf('limit') === -1) {
      seclimit = 'hide';
    }
  }

  // prepare filter form
  const formHTML = `
    <form id=filter method=get action="${currentpagenoqs}">
      <input type=hidden name=domainkey value="${domainkey}">
      <input type=hidden id=interval name=interval value="${interval}">
      <input type=hidden id=offset name=offset value="${offset}">
      <input type=hidden id=limit name=limit value="${limit}">
      <input type=hidden id=limit name=exactmatch value="${exactmatch}">

      <div id=customurl class="customurl ${securl}">
        <div>
          <label for=url>URL</label>
          <input id=url name=url class=noedit value="${url}">
        </div>
        <div id=urlfilter class=" hide">
          <button id=btnurl>Go</button>
        </div>
      </div>
      <div id=customownerrepo class="customownerrepo ${secownerrepo}">
        <div>
          <label for=owner_repo>Owner/Repo</label>
          <input id=owner_repo name=owner_repo class=noedit value="${ownerrepo}">
        </div>
        <div id=ownerrepofilter class=" hide">
          <button id=btnownerrepo>Go</button>
        </div>
      </div>
      <div id=dateinterval class="center wide ${secdate}">
        <button id=int7 class="${int7}">Last 7 days</button>
        <button id=int30 class="${int30}">Last 30 days</button>
        <button id=int90 class="${int90}">Last 90 days</button>
        <button type=button id=intcustom class="${intCustom}">Custom</button>
      </div>
      <div id=customdate class="customdate wide ${customDate} ${secdate}">
        <div>
          <label for=startdate>Start Date</label>
          <input type=date id=startdate name=startdate class=noedit
              min="2020-01-01" max="${maxStartDate}"
              value="${startdate}">
        </div>
        <div>
          <label for=enddate>End Date</label>
          <input type=date id=enddate name=enddate class=noedit
              min="2020-01-01" max="${maxEndDate}"
              value="${enddate}">
        </div>
        <div id=dateerror class="error center hide">
        </div>
        <div id=datefilter class="center hide">
          <button type=button id=btndatefilter>Filter by Date</button>
        </div>
      </div>
      <div id=limit class="center ${seclimit}">
        <button id=limit10 class="${limit10}">Show 10</button>
        <button id=limit30 class="${limit30}">Show 30</button>
        <button id=limit100 class="${limit100}">Show 100</button>
      </div>
    </form>
  `;

  // draw filter form
  block.innerHTML = formHTML;
}

/**
 * Loads and decorates the filter block
 * @param {Element} block The filter block element
 */
export default function decorate(block) {
  // retrieve block config
  const cfg = readBlockConfig(block);

  // draw the form
  drawFilter(block, cfg);

  // add event listeners
  // interval buttons
  block.querySelector('#int7').addEventListener('click', () => {
    changeInterval('7', '0', '', '');
  });
  block.querySelector('#int30').addEventListener('click', () => {
    changeInterval('30', '0', '', '');
  });
  block.querySelector('#int90').addEventListener('click', () => {
    changeInterval('90', '0', '', '');
  });
  block.querySelector('#intcustom').addEventListener('click', () => {
    changeInterval('-1', '-1', '', '');
  });

  // custom date button
  block.querySelector('#btndatefilter').addEventListener('click', () => {
    if (checkDates()) {
      // should always be true because button hidden when dates invalid
      document.getElementById('filter').submit();
    }
  });

  // limit buttons
  block.querySelector('#limit10').addEventListener('click', () => {
    changeLimit('10');
  });
  block.querySelector('#limit30').addEventListener('click', () => {
    changeLimit('30');
  });
  block.querySelector('#limit100').addEventListener('click', () => {
    changeLimit('100');
  });

  // show buttons when input field values change
  block.querySelector('#url').addEventListener('change', () => {
    show('urlfilter', true);
  });
  block.querySelector('#owner_repo').addEventListener('change', () => {
    show('ownerrepofilter', true);
  });
  block.querySelector('#startdate').addEventListener('change', () => {
    checkDates();
  });
  block.querySelector('#enddate').addEventListener('change', () => {
    checkDates();
  });

  // handle focus and blur styling
  block.querySelector('#url').addEventListener('focus', () => {
    focus('url', true);
  });
  block.querySelector('#owner_repo').addEventListener('focus', () => {
    focus('owner_repo', true);
  });
  block.querySelector('#startdate').addEventListener('focus', () => {
    focus('startdate', true);
  });
  block.querySelector('#enddate').addEventListener('focus', () => {
    focus('enddate', true);
  });
  block.querySelector('#url').addEventListener('blur', () => {
    focus('url', false);
    block.querySelector('#url').value = block.querySelector('#url').value.replace(/^http(s)*:\/\//, '');
  });
  block.querySelector('#owner_repo').addEventListener('blur', () => {
    focus('owner_repo', false);
  });
  block.querySelector('#startdate').addEventListener('blur', () => {
    focus('startdate', false);
  });
  block.querySelector('#enddate').addEventListener('blur', () => {
    focus('enddate', false);
  });
}
