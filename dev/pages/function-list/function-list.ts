(function () {
  function sendMessage(data: { to: string; action: string }): void {
    chrome.runtime.sendMessage(data);
  }

  $('.overlay').on('click', e => {
    sendMessage({ to: 'background', action: 'hide-functions' });
    e.stopPropagation();
  });

  $('#close-left-tabs').on('click', e => {
    sendMessage({ to: 'background', action: 'close-left-tabs' });
    e.stopPropagation();
  });

  $('#close-tabs-exclude-current').on('click', e => {
    sendMessage({ to: 'background', action: 'close-tabs-exclude-current' });
    e.stopPropagation();
  });

  $('#close-right-tabs').on('click', e => {
    sendMessage({ to: 'background', action: 'close-right-tabs' });
    e.stopPropagation();
  });
})();
