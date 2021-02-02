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