import { readBlockConfig, getUrlBase } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const typeDict = {
    'date': 'start & end dates',
    'offset': 'offset from current day',
    'interval': 'interval from today',
  }
  const params = new URLSearchParams(window.location.search);

  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));

  const type = cfg.type;

    // once we read config, clear the dom.
  block.querySelectorAll(':scope > div').forEach((row) => {
    row.remove();
  });

  if(type && Object.hasOwn(typeDict, type) && typeDict[type]){
    const form = document.createElement('form');
    const div1 = document.createElement('div');
    const label1 = document.createElement('label');
    const input1 = document.createElement('input');
    const submit = document.createElement('button');
    submit.id = 'date submit'

    function checkDates(start, end){
      if(new Date(start) > new Date(end)){
        throw new Error('Start Date is Greater than End Date')
      }
    }

    function processParams(){
        const start = document.querySelector('input#startdate');
        const end = document.querySelector('input#enddate');

        checkDates(start.value, end.value);

        params.set('startdate', start.value);
        params.set('enddate', end.value);
        let loc = (document.location.origin + document.location.pathname + '?' + params.toString());
        window.location.href = loc;
        console.log('executed');
    }

    if(type === 'date'){
        const input2 = document.createElement('input');
        const label2 = document.createElement('label');
        const div2 = document.createElement('div');
        input1.type = 'date';
        input1.id = label1.id = 'startdate';
        input2.type = 'date';
        input2.id = label2.id = 'enddate';
        input1.min = '2018-01-01';
        input2.min = '2018-01-01';
        let today = new Date();
        const offset = today.getTimezoneOffset(); 
        today = new Date(today.getTime() + (offset*60*1000)); today.toISOString().split('T')[0];
        input1.max = today;
        input2.max = today;
        label1.textContent = 'Start Date';
        label2.textContent = 'End Date';
        div1.appendChild(label1);
        div1.appendChild(input1);
        div2.appendChild(label2);
        div2.appendChild(input2);
        form.appendChild(div1);
        form.appendChild(div2);
        form.appendChild(submit);
        submit.textContent = 'Submit';
        submit.onclick = () => {
              processParams();
              return false;
        }
        block.prepend(form);
    }
  }
}