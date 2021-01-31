(function () {
  function sendMessage(data: { to: string; action: string }): void {
    chrome.runtime.sendMessage(data);
  }

  $('#close-left-tabs').on('click', () => {
    sendMessage({ to: 'background', action: 'close-left-tabs' });
    window.close();
  });

  $('#close-tabs-exclude-current').on('click', () => {
    sendMessage({ to: 'background', action: 'close-tabs-exclude-current' });
    window.close();
  });

  $('#close-right-tabs').on('click', () => {
    sendMessage({ to: 'background', action: 'close-right-tabs' });
    window.close();
  });
})();
