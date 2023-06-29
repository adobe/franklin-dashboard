import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const params = new URLSearchParams(window.location.search);

  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));

  const { type } = cfg;

  function checkDates(start, end) {
    if (new Date(start) > new Date(end)) {
      throw new Error('Start Date is Greater than End Date');
    }
  }

  function processDateInput() {
    const start = document.querySelector('input#start-date');
    const end = document.querySelector('input#end-date');
    const url = document.querySelector('input#url-input');

    checkDates(start.value, end.value);

    params.set('startdate', start.value);
    params.set('enddate', end.value);
    if (type === 'date') {
      params.set('url', url.value);
    } else {
      params.set('owner_repo', url.value);
    }
    const loc = (`${document.location.origin + document.location.pathname}?${params.toString()}`);
    window.location.href = loc;
  }

  if (type === 'date' || type === 'date (sk)') {
    // set id of button
    let startPlaceHolder = 'mm/dd/yyyy';
    let endPlaceHolder = 'mm/dd/yyyy';
    let urlPlaceHolder = 'www.placeholder.com';
    if (params.has('startdate') && params.has('enddate') && (params.has('url') || params.has('owner_repo'))) {
      startPlaceHolder = params.get('startdate');
      endPlaceHolder = params.get('enddate');
      urlPlaceHolder = type === 'date' ? params.get('url') : params.get('owner_repo');
    }
    const minDate = '2018-01-01';
    const today = new Date().toISOString().split('T')[0];
    // space in sk variant must be fixed for query selector
    const selectorType = type === 'date' ? type : 'sk';
    block.innerHTML = `
        <form id="date-form">
          <div>
            ${type === 'date' ? "<label id='url-input'>Site Url</label>" : "<label id='url-input'>Owner/Repo</label>"}
            <input id='url-input' type="text" placeholder="${urlPlaceHolder}" required></input>
          </div>
          <div>
            <label id="start-date">Start Date</label>
            <input id="start-date" type="date" placeholder="${startPlaceHolder}" min="${minDate}" max="${today}" required></input>
          </div>
          <div>
            <label id="end-date">End Date</label>
            <input id="end-date" type="date" placeholder="${endPlaceHolder}" min="${minDate}" max="${today}" required></input>
          </div>
          <div id="${selectorType}-submit">
            <button>Submit</button>
          </div>
        </form>
      `;
    const button = block.querySelector(`#${selectorType}-submit`);
    button.onclick = () => {
      processDateInput();
      return false;
    };
  }
}
