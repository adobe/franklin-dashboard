import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { getQueryInfo, queryRequest, getUrlBase } from '../../scripts/scripts.js';
import { drawLoader, hideLoader } from '../../scripts/loader.js';

export default function decorate(block) {
  let cfg = readBlockConfig(block);
  cfg = Object.fromEntries(Object.entries(cfg).map(([k, v]) => [k, typeof v === 'string' ? v.toLowerCase() : v]));
  const endpoint = cfg.data;

  cfg.block = block;
  const flag = `${endpoint}Flag`;

  // once we read config, clear the dom.
  block.querySelectorAll(':scope > div').forEach((row) => {
    row.style.display = 'none';
  });

  const getQuery = () => {
    if (!Object.hasOwn(window, 'gettingQueryInfo')) {
      getQueryInfo();
    }
    if (Object.hasOwn(window, 'gettingQueryInfo') && window.gettingQueryInfo === true) {
      window.setTimeout(getQuery, 1);
    } else if (Object.hasOwn(window, 'gettingQueryInfo') && window.gettingQueryInfo === false) {
      setTimeout(() => {
        // override default run-query limit with arbitrarily high number and 365 day interval
        queryRequest(cfg, getUrlBase(endpoint), { limit: '100000', interval: '365' });
      }, 3000);

      drawLoader(block);
    }
  };

  const makeList = () => {
    if ((Object.hasOwn(window, flag) && window[flag] === true) || !Object.hasOwn(window, flag) || typeof window.jQuery === 'undefined') {
      window.setTimeout(makeList, 5);
    } else if (Object.hasOwn(window, flag) && window[flag] === false && window.jQuery) {
      // query complete, hide loading graphic
      const { data } = window.dashboard[endpoint].results;
      hideLoader(block);

      // get authorization data called from header
      const authdata = window.dashboard['dash/auth-all-domains'].results.data;
      let auth = false;
      if (authdata[0]) {
        auth = authdata[0].write;
      }

      const params = new URLSearchParams(window.location.search);
      const domainkey = params.get('domainkey');

      // using a table instead of divs to leverage jquery tablesorter
      const table = document.createElement('table');
      table.classList.add('tablesorter');

      // prepare header row
      const thead = document.createElement('thead');
      const header = document.createElement('tr');

      // TODO consider moving fieldset to block config to make block generic
      const headers = [
        { label: 'Domain' },
        { label: 'IMS Org ID', class: 'no-sort' },
        { label: 'First RUM', class: 'right' },
        { label: 'Most Recent RUM', class: 'right' },
        { label: 'Current Month Est. Visits', class: 'right' },
        { label: 'Total Est. Visits', class: 'right' },
      ];
      headers.forEach((field) => {
        const h = document.createElement('th');
        h.textContent = field.label;
        if (field.class) {
          h.classList.add(field.class);
        }
        header.appendChild(h);
      });

      thead.appendChild(header);
      table.appendChild(thead);

      // prepare body rows
      const tbody = document.createElement('tbody');
      for (let i = 0; i < data.length; i += 1) {
        const row = document.createElement('tr');
        const col1 = document.createElement('td');
        col1.innerHTML = `<a href='/views/rum-dashboard?domainkey=${domainkey}&url=${data[i].hostname}'>${data[i].hostname}</a>`;
        const col2 = document.createElement('td');
        if (data[i].ims_org_id) {
          col2.textContent = data[i].ims_org_id;
        } else if (auth) {
          // only show add link to authorized domainkeys
          const addIms = document.createElement('a');
          addIms.textContent = 'add';
          addIms.href = '#';
          addIms.addEventListener('click', () => {
            document.getElementById('url').value = `${data[i].hostname}`;
            document.getElementById('ims').value = '';
            document.getElementById('dlgIms').showModal();
            document.getElementById('ims').focus();
          });
          col2.appendChild(addIms);
        }
        const col3 = document.createElement('td');
        col3.classList.add('right');
        col3.textContent = data[i].first_visit;
        const col4 = document.createElement('td');
        col4.classList.add('right');
        col4.textContent = data[i].last_visit;
        const col5 = document.createElement('td');
        col5.classList.add('right');
        // show 3 significant digits
        col5.textContent = parseFloat(parseInt(data[i].current_month_visits || 0, 10).toPrecision(3)).toLocaleString('en-US');
        const col6 = document.createElement('td');
        col6.classList.add('right');
        // show 3 significant digits
        col6.textContent = parseFloat(parseInt(data[i].total_visits, 10).toPrecision(3)).toLocaleString('en-US');
        row.appendChild(col1);
        row.appendChild(col2);
        row.appendChild(col3);
        row.appendChild(col4);
        row.appendChild(col5);
        row.appendChild(col6);
        tbody.appendChild(row);
      }
      table.appendChild(tbody);

      // dialog for adding IMS org
      const dialog = document.createElement('dialog');
      dialog.id = 'dlgIms';
      const dlgForm = document.createElement('form');

      // input fields
      const inpDomainkey = document.createElement('input');
      inpDomainkey.name = 'domainkey';
      inpDomainkey.type = 'hidden';
      inpDomainkey.value = domainkey;
      const lblDomain = document.createElement('label');
      lblDomain.setAttribute('for', 'url');
      lblDomain.textContent = 'Domain';
      const inpDomain = document.createElement('input');
      inpDomain.id = 'url';
      inpDomain.name = 'url';
      inpDomain.readOnly = true;
      const lblImsOrgId = document.createElement('label');
      lblImsOrgId.setAttribute('for', 'ims');
      lblImsOrgId.textContent = 'IMS Org Id';
      const inpImsOrgId = document.createElement('input');
      inpImsOrgId.id = 'ims';
      inpImsOrgId.name = 'ims';
      inpImsOrgId.placeholder = 'XXXXXXXXXXXXXXXXXXXXXXXX@AdobeOrg';

      // buttons
      const dlgDivBtn = document.createElement('div');
      const dlgBtnConfirm = document.createElement('button');
      dlgBtnConfirm.id = 'dlgBtnConfirm';
      dlgBtnConfirm.addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('dlgBtnConfirm').disabled = true;
        document.getElementById('dlgBtnCancel').disabled = true;

        // update domain info
        const updatecfg = {};
        updatecfg.data = 'dash/update-domain-info';
        const updateendpoint = updatecfg.data;
        const updateflag = `${updateendpoint}Flag`;
        updatecfg.data = 'dash/update-domain-info';
        queryRequest(updatecfg, getUrlBase(updateendpoint), { url: document.getElementById('url').value, ims: document.getElementById('ims').value });

        const readUpdateData = () => {
          // eslint-disable-next-line max-len
          if ((Object.hasOwn(window, updateflag) && window[updateflag] === true) || !Object.hasOwn(window, updateflag)) {
            window.setTimeout(readUpdateData, 50);
          } else if (Object.hasOwn(window, updateflag) && window[updateflag] === false) {
            // query complete
            document.getElementById('dlgIms').close();
            window.location.reload();
          }
        };
        readUpdateData();
      });
      dlgBtnConfirm.textContent = 'Confirm';
      const dlgBtnCancel = document.createElement('button');
      dlgBtnCancel.id = 'dlgBtnCancel';
      dlgBtnCancel.setAttribute('formmethod', 'dialog');
      dlgBtnCancel.textContent = 'Cancel';
      dlgDivBtn.appendChild(dlgBtnConfirm);
      dlgDivBtn.appendChild(dlgBtnCancel);

      dlgForm.appendChild(inpDomainkey);
      dlgForm.appendChild(lblDomain);
      dlgForm.appendChild(inpDomain);
      dlgForm.appendChild(lblImsOrgId);
      dlgForm.appendChild(inpImsOrgId);
      dlgForm.appendChild(dlgDivBtn);
      dialog.appendChild(dlgForm);
      block.appendChild(dialog);

      // add table to block and add sort functionality
      block.appendChild(table);
      // to prevent javascript race condition, call tablesorter only after it loads
      const sorter = () => {
        // eslint-disable-next-line no-undef
        if (typeof $('table.tablesorter').tablesorter === 'undefined') {
          window.setTimeout(sorter, 5);
        } else {
          // eslint-disable-next-line no-undef
          $('table.tablesorter').tablesorter({ headers: { '.no-sort': { sorter: false } } });
        }
      };
      sorter();

      if (data.length === 0) {
        const noresults = document.createElement('p');
        if (params.has('domainkey')) {
          noresults.textContent = 'No results found.';
        } else {
          noresults.innerHTML = '<i>domainkey</i> is required.  Please provide <a href="/all-domains/">here</a>.';
        }
        block.append(noresults);
      }
    }
  };
  getQuery();
  makeList();
}
