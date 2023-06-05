import { readBlockConfig, getUrlBase } from '../../scripts/lib-franklin.js';

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
      form.id = 'date_form'
      let startPlaceHolder = 'mm/dd/yyyy';
      let endPlaceHolder = 'mm/dd/yyyy';
      let urlPlaceHolder = 'www.placeholder.com';
      if(params.has('startdate') && params.has('enddate') && (params.has('url') || params.has('owner_repo'))){
        startPlaceHolder = params.get('startdate');
        endPlaceHolder = params.get('enddate');
        urlPlaceHolder = type === 'date' ? params.get('url') : params.get('owner_repo');
      }
      const input2 = document.createElement('input');
      const label2 = document.createElement('label');
      const div2 = document.createElement('div');
      const input3 = document.createElement('input');
      const label3 = document.createElement('label');
      const div3 = document.createElement('div');
      input1.type = 'date';
      input1.id = label1.id = 'startdate';
      input1.placeholder = startPlaceHolder;
      input2.type = 'date';
      input2.id = label2.id = 'enddate';
      input2.placeholder = endPlaceHolder;
      input1.min = '2018-01-01';
      input2.min = '2018-01-01';
      label3.id = 'url_input'
      label3.textContent = type === 'date' ? 'Franklin VIP Url' : 'Franklin Owner/Repo'
      input3.id = 'url_input'
      input3.type = 'text';
      input3.placeholder = urlPlaceHolder;
      let today = new Date().toISOString().split('T')[0];
      input1.max = today;
      input2.max = today;
      label1.textContent = 'Start Date';
      label2.textContent = 'End Date';
      input1.required = true;
      input2.required = true;
      input3.required = true;
      div1.appendChild(label1);
      div1.appendChild(input1);
      div2.appendChild(label2);
      div2.appendChild(input2);
      div3.appendChild(label3);
      div3.appendChild(input3);
      form.appendChild(div3);
      form.appendChild(div1);
      form.appendChild(div2);
      submit.textContent = 'Submit';
      form.appendChild(submit);
      submit.onclick = () => {
          processDateInput();
          return false;
      }
      block.prepend(form);
  }
}