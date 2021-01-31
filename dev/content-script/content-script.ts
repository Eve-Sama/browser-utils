// Listen message from popup or background;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { to, action } = request;
  if (to !== 'content-script') {
    return;
  }
  switch (action) {
    case 'show-functions':
      showFunctions();
      break;
    case 'hide-functions':
      hideFunctions();
      break;
  }
});

// Below functions should be writen in another js file named 'dom.js'
function showFunctions(): void {
  const isExist = $('#plugin-utils-iframe').length;
  if (isExist) {
    return;
  }
  const url = chrome.extension.getURL('dist/pages/function-list/function-list.html');
  const iframe = $(
    `<iframe id='plugin-utils-iframe' src=${url} style='z-index: 2147483647; border: medium none; top: 0px; left: 0px; margin: 0px; clip: auto; position: fixed !important;background-color: transparent; width: 100%; height: 100%; display: block;'></iframe>`
  );
  $('body').append(iframe);
}

function hideFunctions(): void {
  const element = $('#plugin-utils-iframe');
  element.remove();
}
