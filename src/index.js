import { StoreLayer } from '@maksimr/ui/react/StoreLayer';
import { installLinkClickInterceptor } from '@maksimr/ui/link-click-interceptor';
import React from 'react';
import { render } from 'react-dom';
import { App } from './components/App';
import { store, updatePath } from './store';
import { fetchIssues } from './api';

function main() {
  useHistoryApi(updatePath);
  fetchIssues().then((data) => {
    store.swap((state) => {
      state.view['/'].issues = data;
    });
  });

  render(
    <StoreLayer store={store}>
      <App/>
    </StoreLayer>,
    document.getElementById('app')
  );

  function useHistoryApi(onChange) {
    window.addEventListener('popstate', () => {
      const path = window.location.href.replace(window.location.origin, '');
      onChange(path);
    });

    installLinkClickInterceptor((element) => {
      const path = element.getAttribute('href');
      const href = element.href;
      window.history.pushState(null, '', href);
      onChange(path);
    });
  }
}

main();
