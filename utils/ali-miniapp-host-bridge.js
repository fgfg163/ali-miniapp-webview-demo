function bridge(my, webViewContext) {
  const INNER_GET_CONFIG = 'INNER_GET_CONFIG';
  const INNER_GET_CONFIG_CALL_BACK = 'INNER_GET_CONFIG_CALL_BACK';
  const INNER_REGIST_FUNC = 'INNER_REGIST_FUNC';
  const INNER_CLEAR_REGIST_FUNC = 'INNER_CLEAR_REGIST_FUNC';
  const INNER_CALL_FUNCTION = 'INNER_CALL_FUNCTION';
  const INNER_CALL_FUNCTION_CALL_BACK = 'INNER_CALL_FUNCTION_CALL_BACK';
  const OUTER_CALL_FUNCTION = 'OUTER_CALL_FUNCTION';
  const OUTER_CALL_FUNCTION_CALL_BACK = 'OUTER_CALL_FUNCTION_CALL_BACK';
  
  this.webView = {};
  const _this = this;

  const addOnKeys = [];

  const sendConfigKeys = {};
  Object.keys(my).forEach(function(key) {
    if (typeof (my[key]) === 'function') {
      sendConfigKeys[key] = key;
    }
  });
  addOnKeys.forEach(function(key) {
      sendConfigKeys[key] = key;
  });

  this.onMessage = function(event) {
    const action = event.detail;
    if (typeof (action) === 'object' && typeof (action.type) === 'string') {
      if (action.type === INNER_GET_CONFIG) {
        const newMy = [];
        Object.keys(sendConfigKeys).forEach(function(key) {
          if (typeof (my[key]) === 'function') {
            newMy.push({
              name: key,
              type: typeof (my[key]),
            });
          } else {
            newMy.push({
              name: key,
              type: typeof (my[key]),
              value: my[key],
            });
          }
        });
        webViewContext.postMessage({
          type: INNER_GET_CONFIG_CALL_BACK,
          list: newMy,
        });
      } else if (action.type === INNER_REGIST_FUNC) {
        var list = action.list || [];
        _this.webView = _this.webView || {};
        list.forEach(function(field) {
          if (field.type === 'function') {
            _this.webView[field.name] = function(...args) {
              webViewContext.postMessage({
                type: OUTER_CALL_FUNCTION,
                name: field.name,
                params: args,
              });
            };
          } else {
            _this.webView[field.name] = field.value;
          }
        });
      } else if (action.type === INNER_CLEAR_REGIST_FUNC) {
        _this.webView = {};
      } else if (action.type === INNER_CALL_FUNCTION) {
        
      }
    }
  };
}

export default bridge;