import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export async function saveSnapshot(sessionId, data) {
  try {
    const json = JSON.stringify(data);
    sessionStorage.setItem(`snapshot:${sessionId}`, json);
    console.log(`Snapshot saved in sessionStorage: snapshot:${sessionId}`);
  } catch (err) {
    console.error('❌ Failed to save snapshot:', err);
  }
}

export async function loadSnapshot(sessionId) {
  try {
    const raw = sessionStorage.getItem(`snapshot:${sessionId}`);
    if (!raw) throw new Error('No snapshot found');
    return JSON.parse(raw);
  } catch (err) {
    console.error('❌ Failed to load snapshot:', err);
    return null;
  }
}

export default async function decorate(block) {
  const params = new URLSearchParams(window.location.search);
  const domain = params.get('domain') || 'default-domain';
  const domainkey = params.get('domainkey') || 'default-domainkey';
  const startdate = params.get('startdate') || 'default-date'
  const enddate = params.get('enddate') || 'default-date'

  block.innerHTML = '';

  // === Create loader (spinner only) ===
  const loader = document.createElement('div');
  loader.classList.add('loading-indicator');
  loader.style.display = 'none';

  // === Create grid ===
  const grid = document.createElement('div');
  grid.classList.add('gallery-grid');
  block.appendChild(grid);

  // === Create "More" button ===
  const moreBtn = document.createElement('button');
  moreBtn.textContent = 'More Opportunities';
  moreBtn.classList.add('load-more-btn');
  moreBtn.style.display = 'none';

  block.appendChild(loader);
  block.appendChild(moreBtn); // append after loader so loader can replace it

  // === API Setup ===
  const apiURL = new URL('http://localhost:8001/get-bboxes/start');
  apiURL.searchParams.set('domain', domain);
  apiURL.searchParams.set('checkpoint', 'click');
  apiURL.searchParams.set('domainkey', domainkey);
  apiURL.searchParams.set('startdate', startdate)
  apiURL.searchParams.set('enddate', enddate)


  let sessionId = null;
  let cursor = 0;
  let total = 0;

  requestAnimationFrame(async () => {
    try {
      loader.style.display = 'block';
      moreBtn.style.display = 'none';

      const res = await fetch(apiURL.toString());
      const data = await res.json();


      sessionId = data.sessionId;
      cursor = data.cursor;
      total = data.total;
      const results = data.result || [];

      if (results.length === 0) {
        block.appendChild(document.createTextNode('No opportunities found.'));
        loader.remove();
        moreBtn.remove();
        return;
      }

      renderResults(results, grid);

      loader.style.display = 'none';
      moreBtn.style.display = 'block';

      moreBtn.addEventListener('click', async () => {
        if (cursor >= total) {
          moreBtn.disabled = true;
          moreBtn.textContent = 'No more opportunities';
          return;
        }

        moreBtn.replaceWith(loader);
        loader.style.display = 'block';

        const nextURL = new URL('http://localhost:8001/get-bboxes/next');
        
        try {
          const nextRes = await fetch(nextURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: data.raw,        // ← the full data array
              cursor,      // ← current offset
              domain,      // ← e.g. "wilson"
              checkpoint: 'click',  // ← e.g. "click"
              domainkey,   // ← whatever your key is
            })
          });
        
          const nextData = await nextRes.json();
          const nextResults = nextData.result || [];

          if (nextResults.length === 0) {
            loader.remove();
            return;
          }

          renderResults(nextResults, grid);
          cursor = nextData.cursor;

          loader.replaceWith(moreBtn);
          moreBtn.style.display = 'block';

          if (cursor >= total) {
            moreBtn.disabled = true;
            moreBtn.textContent = 'No more opportunities';
          }
        } catch (err) {
          console.error('📸 Failed to load next batch:', err);
          loader.remove();
        }
      });
    } catch (err) {
      console.error('📸 Failed to load snapshots:', err);
      block.innerHTML = '<p>Failed to load visual opportunities.</p>';
    }
  });
}

function renderResults(results, grid) {
  results.forEach((result) => {
    const sources = result?.[0]?.sources || result?.sources || [];
    sources.forEach((item) => {
      const card = document.createElement('div');
      card.classList.add('gallery-card');

      if (item.mobile_snapshots) {
        card.classList.add('mobile');
      }

      const snapshotWrapper = document.createElement('div');
      snapshotWrapper.classList.add('gallery-image-wrapper');

      if (item.mobile_snapshots) {
        const elementImg = document.createElement('img');
        elementImg.src = item.mobile_snapshots.element_snapshot;
        elementImg.alt = `Element Snapshot`;
        elementImg.loading = 'lazy';
        snapshotWrapper.appendChild(elementImg);

        const viewportImg = document.createElement('img');
        viewportImg.src = item.mobile_snapshots.viewport_snapshot;
        viewportImg.alt = `Viewport Snapshot`;
        viewportImg.loading = 'lazy';
        snapshotWrapper.appendChild(viewportImg);
      } else {
        const img = document.createElement('img');
        img.src = item.snapshot;
        img.alt = `Snapshot`;
        img.loading = 'lazy';
        snapshotWrapper.appendChild(img);
      }

      const caption = document.createElement('div');
      caption.classList.add('gallery-card-details');
      caption.innerHTML = `
        <div class="url"><strong>Page:</strong> <a href="${item.url}" target="_blank">${item.url}</a></div>
      `;

      // Tags
      const tagList = ['Low contrast', 'Too many CTAs', 'Cookie banner overlap', 'Below-the-fold CTA'];
      const selectedTags = new Set();
      const tagContainer = document.createElement('div');
      tagContainer.classList.add('card-tags');

      tagList.forEach((tagText) => {
        const tag = document.createElement('span');
        tag.classList.add('tag');
        tag.textContent = tagText;

        tag.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent zoom
          tag.classList.toggle('selected');
          if (selectedTags.has(tagText)) {
            selectedTags.delete(tagText);
          } else {
            selectedTags.add(tagText);
          }
        });

        tagContainer.appendChild(tag);
      });

      // Buttons
      const actions = document.createElement('div');
      actions.classList.add('card-actions');

      const approveBtn = document.createElement('button');
      approveBtn.classList.add('approve-btn');
      approveBtn.textContent = '✅ Approve';

      const dismissBtn = document.createElement('button');
      dismissBtn.classList.add('dismiss-btn');
      dismissBtn.textContent = '❌ Dismiss';

      approveBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent zoom
        const endpoint = new URL('http://localhost:8001/approve');
        endpoint.searchParams.set('url', item.url);
        selectedTags.forEach(tag => endpoint.searchParams.append('tag', tag));

        try {
          await fetch(endpoint.toString(), { method: 'POST' });
          card.style.opacity = '0';
          card.style.transform = 'scale(0.98)';
          setTimeout(() => card.remove(), 200);
        } catch (err) {
          console.error('Failed to send approval', err);
        }
      });

      dismissBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent zoom
        card.style.opacity = '0';
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
          card.remove();
          document.querySelector('.load-more-btn')?.click();
        }, 200);
      });

      actions.appendChild(dismissBtn);
      actions.appendChild(approveBtn);

      card.appendChild(snapshotWrapper);
      card.appendChild(caption);
      card.appendChild(tagContainer);
      card.appendChild(actions);
      grid.appendChild(card);

      // === Zoom Modal on Card Click ===
      card.addEventListener('click', () => {
        const modal = document.querySelector('.zoom-modal');
        const modalContent = modal.querySelector('.zoom-modal-content');

        const clone = card.cloneNode(true);
        clone.classList.add('zoomed');
        modalContent.innerHTML = '';
        modalContent.appendChild(clone);
        modal.classList.add('active');
      });
    });
  });
}

// === Create and attach modal to page ===
const modal = document.createElement('div');
modal.classList.add('zoom-modal');
modal.innerHTML = `<div class="zoom-modal-content"></div>`;
document.body.appendChild(modal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
    modal.querySelector('.zoom-modal-content').innerHTML = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.remove('active');
    modal.querySelector('.zoom-modal-content').innerHTML = '';
  }
});