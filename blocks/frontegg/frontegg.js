// import { readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * parses a JWT token
 * @param {String} token The access token from frontegg
 */
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

  return JSON.parse(jsonPayload);
}

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
      console.log('before initialize');
      const app = Frontegg.initialize({
        contextOptions: {
          baseUrl: 'https://app-51s9vo0yeeq4.frontegg.com',
          clientId: 'fa530c84-bc31-4fef-ab80-22acc71619ef',
        },
        hostedLoginBox: true,
      });
      console.log('after initialize');

      document.getElementById('loginWithRedirect').addEventListener('click', () => {
        console.log("app.loginWithRedirect");
        app.loginWithRedirect();
      });

      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerHTML = '';
      document.getElementsByTagName('head')[0].appendChild(style);

      let keyRequested = false;

      app.store.subscribe(() => {
        console.log('before app.store.getState');
        const state = app.store.getState();
        console.log('state is ' + JSON.stringify(state));
        document.getElementById('app-root').style.display = state.auth.isLoading ? 'hidden' : 'block';

        if (state.auth.user) {
          // the user has authenticated using the magic link provided by frontegg
          if (!keyRequested) {
            const { email } = state.auth.user;
            const emailDomain = email.split('@').pop();
            const parsedUser = parseJwt(state.auth.user.accessToken);
            console.log('jwt parsed');
  
            // set default domain key options
            let resp = '';
            // let dkUrl = emailDomain;
            // let dkExpiry = '';
  
            if (parsedUser.email_verified) {
              if (emailDomain === 'adobe1.com') {
                // determine options for domain key
              } else {
                // generate domain key with no further input required
                const endpoint = new URL('https://eynvwoxb7l.execute-api.us-east-1.amazonaws.com/helix-services/domainkey-provider/ci149');
                const body = {
                  domain: emailDomain,
                  token: state.auth.user.accessToken,
                };
  
                keyRequested = true;

                fetch(endpoint, {
                  method: 'POST',
                  body: JSON.stringify(body),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }).then((response) => response.json()).then((data) => {
                  resp = JSON.stringify(data);
                  console.log(resp);
                });
                
                console.log("logged in");
                /*
                const json = await res.json();
                if (!res.ok || json.results.data[0].status !== 'success') {
                  return new Response(`Error while rotating domain keys: ${res.statusText}`, {
                    status: 503,
                  });
                }
                return new Response(JSON.stringify(json.results.data[0]), {
                  status: 201,
                  headers: {
                    'content-type': 'application/json',
                  },
                });
                */
              }
            }
            document.getElementById('user-container').innerHTML = `
                email: ${email}
                <br>
                access token: ${state.auth.user.accessToken}
                <br>
                decoded: ${JSON.stringify(parseJwt(state.auth.user.accessToken))}
                <br>
                resp: ${resp}
              `;
          }
          
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
