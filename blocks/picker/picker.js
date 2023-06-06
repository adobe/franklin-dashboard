import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const params = new URLSearchParams(window.location.search);

  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));

  const type = cfg.type;

    // once we read config, clear the dom.
  block.querySelectorAll(':scope > div').forEach((row) => {
    row.remove();
  });

    const form = document.createElement('form');
    const div1 = document.createElement('div');
    const label1 = document.createElement('label');
    const input1 = document.createElement('input');
    const submit = document.createElement('button');
    submit.id = `${type}_submit`;

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

  if(type === 'date' || type === 'date (sk)'){
      //set id of button
      let startPlaceHolder = 'mm/dd/yyyy';
      let endPlaceHolder = 'mm/dd/yyyy';
      let urlPlaceHolder = 'www.placeholder.com';
      if(params.has('startdate') && params.has('enddate') && (params.has('url') || params.has('owner_repo'))){
        startPlaceHolder = params.get('startdate');
        endPlaceHolder = params.get('enddate');
        urlPlaceHolder = type === 'date' ? params.get('url') : params.get('owner_repo');
      }
      const minDate = '2018-01-01';
      let today = new Date().toISOString().split('T')[0];
      //space in sk variant must be fixed for query selector
      let selectorType = type === 'date' ? type : 'sk'
      block.innerHTML = `
        <form id="date_form">
          <div>
            ${type === 'date' ? "<label id='url_input'>Site Url</label" : "<label id='url_input'>Owner/Repo</label>"}
            <input id='url_input' type="text" placeholder="${urlPlaceHolder}"></input>
          </div>
          <div>
            <label id="startdate">Start Date</label>
            <input id="startdate" type="date" placeholder="${startPlaceHolder}" min="${minDate}" max="${today}"></input>
          </div>
          <div>
            <label id="enddate">End Date</label>
            <input id="enddate" type="date" placeholder="${endPlaceHolder}" min="${minDate}" max="${today}"></input>
          </div>
          <div id="${selectorType}_submit">
            <button>Submit</button>
          </div>
        </form>
      `
      let button = block.querySelector(`#${selectorType}_submit`);
      button.onclick = () => {
        processDateInput();
        return false;
      }
    }
  }