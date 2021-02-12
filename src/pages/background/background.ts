(function () {
  function notifyActiveTab(action: string): void {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { to: 'content-script', action }, null);
    });
  }

  chrome.commands.onCommand.addListener(function (command) {
    if (command == 'showFunctions') {
      notifyActiveTab('show-functions');
    }
  });

  chrome.runtime.onMessage.addListener(req => {
    const { to, action } = req;
    if (to !== 'background') {
      return;
    }
    switch (action) {
      case 'close-left-tabs':
        closeTabs('left');
        notifyActiveTab('hide-functions');
        break;
      case 'close-tabs-exclude-current':
        closeTabs('excludeCurrent');
        notifyActiveTab('hide-functions');
        break;
      case 'close-right-tabs':
        closeTabs('right');
        notifyActiveTab('hide-functions');
        break;
      case 'hide-functions':
        notifyActiveTab('hide-functions');
        break;
    }
  });

  // #region Operate tabs
  /**
   * chrome.tabs only works in background and popup, and event may be emitted from popup or page.
   * Therefore, I put the functions in background.
   */
  function calcTabs(): Promise<{ direction: 'left' | 'right' | 'current'; id: number }[]> {
    return new Promise(resolve => {
      chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, res => {
        let isNowLeft = true;
        const tabs = res.map(tab => {
          let direction: 'left' | 'current' | 'right' = isNowLeft ? 'left' : 'right';
          if (tab.active) {
            isNowLeft = false;
            direction = 'current';
          }
          return { direction, id: tab.id };
        });
        resolve(tabs);
      });
    });
  }

  /**
   * Close tabs
   * @param type Close left or right tabs, and 'excludeCurrent' means only keep current active tab
   */
  async function closeTabs(type: 'left' | 'right' | 'excludeCurrent'): Promise<void> {
    const tabs = await calcTabs();
    tabs.forEach(tab => {
      if (type === 'left' && tab.direction === 'left') {
        chrome.tabs.remove(tab.id);
      } else if (type === 'right' && tab.direction === 'right') {
        chrome.tabs.remove(tab.id);
      } else if (type === 'excludeCurrent' && tab.direction !== 'current') {
        chrome.tabs.remove(tab.id);
      }
    });
  }
  // #endregion
})();
