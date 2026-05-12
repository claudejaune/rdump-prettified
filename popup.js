const dmp_all_btn    = document.getElementById("dmp_all_btn");
const dmp_btn        = document.getElementById("dmp_btn");
const all_tabs       = document.getElementById("all_tabs");
const fileInput      = document.getElementById("fileInput");
const fileNameInput  = document.getElementById("file_name");
const themeSelect    = document.getElementById("theme-select");
const statusMessage  = document.getElementById("status-message");
let textFile = null;

// Custom dropdown helper
function setupDropdown(id) {
  const dd = document.getElementById(id);
  const selected = dd.querySelector('.cyber-dd-selected');
  const textEl = selected.querySelector('.cyber-dd-text');
  const menu = dd.querySelector('.cyber-dd-menu');
  const options = menu.querySelectorAll('.cyber-dd-option');
  let currentValue = options[0].dataset.value;

  function setValue(value, skipDispatch) {
    currentValue = value;
    const opt = menu.querySelector(`[data-value="${value}"]`);
    if (opt) {
      textEl.textContent = opt.dataset.text;
      options.forEach(o => o.classList.toggle('selected', o === opt));
    }
    if (!skipDispatch) dd.dispatchEvent(new Event('change'));
  }

  function open() {
    options.forEach(opt => {
      opt.textContent = opt.dataset.prefix + opt.dataset.text;
    });
    dd.classList.add('open');
  }

  function close() {
    dd.classList.remove('open');
    textEl.textContent = menu.querySelector('.selected')?.dataset.text || '';
  }

  selected.addEventListener('click', () => {
    dd.classList.contains('open') ? close() : open();
  });

  selected.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dd.classList.contains('open') ? close() : open(); }
    if (e.key === 'Escape') close();
  });

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      setValue(opt.dataset.value);
      close();
    });
  });

  document.addEventListener('click', (e) => {
    if (!dd.contains(e.target)) close();
  });

  dd._getValue = () => currentValue;
  dd._setValue = setValue;
  dd._open = open;
  dd._close = close;

  return dd;
}

const separatorSelect = setupDropdown('separator-select');
const outputSelect   = setupDropdown('output-select');

// keep the same injected style for .tab-item/.tab-label
const style = document.createElement('style');
style.textContent = `
.tab-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.tab-label {
  font-family: Arial, sans-serif;
  font-size: 14px;
  cursor: pointer;
}
`;
document.head.appendChild(style);

// Theme switching functionality
function applyTheme(theme) {
  // Remove all theme classes
  document.body.classList.remove('theme-light-blue');
  
  // Apply selected theme
  if (theme === 'light-blue') {
    document.body.classList.add('theme-light-blue');
  }
  
  // Save theme preference
  chrome.storage.local.set({ theme: theme });
}

function loadTheme() {
  // Load saved theme preference, default to 'cyberpunk'
  chrome.storage.local.get(['theme'], function(result) {
    const savedTheme = result.theme || 'cyberpunk';
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);
  });
}

// Theme selector event listener
if (themeSelect) {
  themeSelect.addEventListener('change', () => {
    applyTheme(themeSelect.value);
  });
}

// Initialize theme on page load
loadTheme();

// Status message functionality
function showStatusMessage(message, type = 'info') {
  // Clear any existing timeout
  if (window.statusMessageTimeout) {
    clearTimeout(window.statusMessageTimeout);
  }
  
  // Set message and type
  statusMessage.textContent = message;
  statusMessage.className = 'status-message show ' + type;
  
  // Hide after 3 seconds
  window.statusMessageTimeout = setTimeout(() => {
    statusMessage.classList.remove('show');
    // Clear text after fade out
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = 'status-message';
    }, 300);
  }, 3000);
}

function showCopyingStatus() {
  if (outputSelect._getValue() === 'clipboard') {
    showStatusMessage('Copying to clipboard...', 'info');
  }
}

function getSeparator() {
  return separatorSelect._getValue() === 'space' ? ' ' : '\n';
}

function updateOutputMode() {
  const isClipboard = outputSelect._getValue() === 'clipboard';
  fileNameInput.disabled = isClipboard;
  dmp_btn.textContent     = isClipboard ? 'COPY SELECTED' : 'EXPORT SELECTED';
  dmp_all_btn.textContent = isClipboard ? 'COPY ALL'      : 'EXPORT ALL';
}

chrome.storage.local.get(['separator', 'outputMode'], (result) => {
  if (result.separator) separatorSelect._setValue(result.separator, true);
  if (result.outputMode) outputSelect._setValue(result.outputMode, true);
  updateOutputMode();
});

separatorSelect.addEventListener('change', () => {
  chrome.storage.local.set({ separator: separatorSelect._getValue() });
});

outputSelect.addEventListener('change', () => {
  chrome.storage.local.set({ outputMode: outputSelect._getValue() });
  updateOutputMode();
});



// list all tabs in current window
chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, tabs => {
  tabs.forEach((tab, index) => {
    const tabItem = document.createElement('div');
    tabItem.className = 'tab-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `tab${index}`;
    checkbox.name = 'tabs';
    checkbox.value = JSON.stringify(tab);
    checkbox.className = 'tab-checkbox';

    const label = document.createElement('label');
    label.htmlFor = `tab${index}`;
    label.className = 'tab-label';
    label.textContent = tab.title;

    tabItem.appendChild(checkbox);
    tabItem.appendChild(label);
    all_tabs.appendChild(tabItem);
  });
});

// helper to create a .txt and download
function downloadTabs(tabs, file_name) {
  const text = tabs.map(tab => tab.url).join(getSeparator());
  const blob = new Blob([text], {type: 'text/plain'});
  if (textFile) window.URL.revokeObjectURL(textFile);
  textFile = window.URL.createObjectURL(blob);

  chrome.downloads.download({
    url: textFile,
    filename: `${file_name}.txt`,
  }, id => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log('Download initiated with ID:', id);
    }
  });
}

// helper to copy URLs to clipboard
function copyToClipboard(tabs) {
  const text = tabs.map(t => t.url).join(getSeparator());
  
  // Show copying status
  showCopyingStatus();
  
  return navigator.clipboard.writeText(text)
    .then(() => {
      console.log('URLs copied to clipboard');
      showStatusMessage('Copied to clipboard!', 'success');
      return true;
    })
    .catch(err => {
      console.error('Copy failed', err);
      showStatusMessage('Copy failed. Please try again.', 'error');
      return false;
    });
}

// export selected tabs
function dump() {
  const mode = outputSelect._getValue();
  const selected = Array.from(document.querySelectorAll('input[name="tabs"]:checked'))
    .map(cb => JSON.parse(cb.value));

  // Check if any tabs are selected for clipboard mode
  if (mode === 'clipboard' && selected.length === 0) {
    showStatusMessage('No tabs selected. Please select at least one tab.', 'error');
    return;
  }

  if (mode === 'file') {
    if (!fileNameInput.value.trim()) {
      showStatusMessage('Please enter a filename to save.', 'error');
      return;
    }
    downloadTabs(selected, fileNameInput.value);
    showStatusMessage('Download started...', 'info');
  } else {
    copyToClipboard(selected);
  }
}

// export all tabs
function dumpAll() {
  const mode = outputSelect._getValue();
  
  if (mode === 'file' && !fileNameInput.value.trim()) {
    showStatusMessage('Please enter a filename to save.', 'error');
    return;
  }
  
  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, tabs => {
    if (mode === 'file') {
      downloadTabs(tabs, fileNameInput.value);
      showStatusMessage('Download started...', 'info');
    } else {
      copyToClipboard(tabs);
    }
  });
}

// file‐input → open URLs
function readFileToArray(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => res(e.target.result.split(getSeparator()));
    reader.onerror = rej;
    reader.readAsText(file);
  });
}

function load() {
  fileInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const urls = await readFileToArray(file);
      urls.forEach(url => chrome.tabs.create({ url }));
    } catch (err) {
      console.error('Error reading file:', err);
    }
  });
}

// wire up buttons
dmp_btn.addEventListener('click', dump);
dmp_all_btn.addEventListener('click', dumpAll);
load();
