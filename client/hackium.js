// @ts-nocheck
; (function (global, clientId, debug) {

  function log(...args) {
    if (debug) console.log(...args);
  }

  log(`loading ${clientId} client`);

  const eventHandlerName = '%%%clienteventhandler%%%';

  const client = {
    version: '%%%HACKIUM_VERSION%%%',
    postMessage(name, data) {
      window.postMessage({ owner: clientId, name, data }, (response) => {
        console.log(response);
      })
    },
    eventBridge: {
      send: (name, data) => {
        log(`sending ${name} event to handler`);
        const handler = global[eventHandlerName];
        if (!handler || typeof handler !== 'function') throw new Error(`${name} client event handler not a function`);
        handler({
          owner: clientId,
          name,
          data
        })
      }
    },
    init() {
      client.postMessage('clientLoaded')
    }
  }

  if (typeof global[clientId] === 'object') {
    log(`merging ${clientId} client with existing object`);
    global[clientId] = Object.assign(client, global[clientId]);
  } else {
    log(`creating ${clientId} object on global`);
    global[clientId] = client;
  }

  window.addEventListener('message', (evt) => {
    if (evt.data.owner !== 'hackium') return;
    const handler = window[eventHandlerName];
    if (handler && typeof handler === 'function') handler(evt.data);
  })

  client.init();

  log(`loaded ${clientId} client`);
}(window, '%%%clientid%%%', true));
