import jwt_decode from 'jwt-decode';
// import { readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the frontegg block
 * @param {Element} block The frontegg block element
 */
export default async function decorate(block) {
  // read block params
  // const cfg = readBlockConfig(block);
  // TODO determine block config params
  // const { code } = cfg;

  const fronteggScript = document.createElement('script');
  fronteggScript.type = 'application/javascript';
  fronteggScript.src = 'https://cdn.jsdelivr.net/npm/@frontegg/js@6.51.0/umd/frontegg.production.min.js';
  document.head.appendChild(fronteggScript);

  /*
  const jwtScript = document.createElement('script');
  jwtScript.type = 'application/javascript';
  jwtScript.src = '/scripts/jwt-decode.js';
  document.head.appendChild(jwtScript);
  */

  const code1 = `
    <div id="app-root" style="display: none">
      <div id="user-container">
      </div>
      <br/>
      <a id="logout" fe-state="isAuthenticated"><button>Logout</button></a>
      <button id="loginWithRedirect" fe-mode="hosted"  fe-state="!isAuthenticated">
          Get Domain Key
      </button>
    </div>
  `;

  block.innerHTML = code1;

  const initfe = () => {
    if (typeof Frontegg === 'undefined') {
      window.setTimeout(initfe, 5);
    } else {
      // eslint-disable-next-line no-undef
      const app = Frontegg.initialize({
        contextOptions: {
          baseUrl: 'https://app-51s9vo0yeeq4.frontegg.com', // set your Frontegg environment domain and client ID here
          clientId: 'fa530c84-bc31-4fef-ab80-22acc71619ef',
        },
        authOptions: {
          // keepSessionAlive: true // Uncomment this in order to maintain the session alive
        },
        hostedLoginBox: true,
      });

      /*
      app.ready(() => {
        console.log('App is ready');
      });
      */

      document.getElementById('loginWithRedirect').addEventListener('click', () => {
        app.loginWithRedirect();
      });

      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerHTML = '';
      document.getElementsByTagName('head')[0].appendChild(style);

      app.store.subscribe(() => {
        const state = app.store.getState();
        document.getElementById('app-root').style.display = state.auth.isLoading ? 'hidden' : 'block';

        if (state.auth.user) {
          document.getElementById('user-container').innerHTML = `
              email: ${state.auth.user.email}
              <br>
              access token: ${state.auth.user.accessToken}
              <br>
              decoded: ${jwt_decode(state.auth.user.accessToken)}
            `;
        } else {
          document.getElementById('user-container').innerText = '';
        }

        let styleHtml = '';
        if (state.auth.isAuthenticated) {
          styleHtml += '[fe-state="isAuthenticated"] { }';
          styleHtml += '[fe-state="!isAuthenticated"] { display: none; }';
        } else {
          styleHtml += '[fe-state="isAuthenticated"] { display: none; }';
          styleHtml += '[fe-state="!isAuthenticated"] { }';
        }

        if (app.options.hostedLoginBox) {
          styleHtml += '[fe-mode="hosted"] { }';
          styleHtml += '[fe-mode="embedded"] { display: none; }';
        } else {
          styleHtml += '[fe-mode="hosted"] { display: none; }';
          styleHtml += '[fe-mode="embedded"] { }';
        }
        style.innerHTML = styleHtml;
      });

      document.getElementById('loginWithRedirect').addEventListener('click', () => {
        app.loginWithRedirect();
      });

      document.getElementById('logout').addEventListener('click', () => {
        app.logout();
      });
    }
  };
  initfe();
}
