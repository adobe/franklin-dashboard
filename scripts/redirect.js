/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-regex-literals */
if (new RegExp('hlx\\.live$').test(location.hostname) || new RegExp('hlx\\.page$').test(location.hostname)) {
  const queryParams = new URLSearchParams(location.search);
  const newQp = new URLSearchParams();
  const qpList = ['domainkey', 'startdate', 'enddate', 'url'];
  let requiredQueryParamsFlag = true;
  qpList.forEach((qp) => {
    if (!queryParams.has(qp)) {
      requiredQueryParamsFlag = false;
    } else {
      newQp.set(qp, queryParams.get(qp));
    }
  });

  if (requiredQueryParamsFlag) {
    location.href = `https://data.aem.live/rum-dashboard?${newQp.toString()}`;
  } else {
    location.href = 'https://data.aem.live';
  }
}
