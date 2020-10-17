const namespace = `circles-${process.env.NODE_ENV}`;

function getPath(key) {
  // WARNING: Settings this env var will reset all users accounts as they will
  // loose access to their former LocalStorage data. This should only be used
  // for breaking app releases!
  if (process.env.STORAGE_NAMESPACE) {
    return `${namespace}-${process.env.STORAGE_NAMESPACE}-${key}`;
  }

  return `${namespace}-${key}`;
}

export function isAvailable() {
  try {
    setItem('test', 1337);
    removeItem('test');

    return true;
  } catch {
    return false;
  }
}

export function getItem(key) {
  return window.localStorage.getItem(getPath(key));
}

export function hasItem(key) {
  const value = getItem(key);
  return value !== null && value !== 'null' && value !== 'undefined';
}

export function setItem(key, value) {
  return window.localStorage.setItem(getPath(key), value);
}

export function removeItem(key) {
  return window.localStorage.removeItem(getPath(key));
}
