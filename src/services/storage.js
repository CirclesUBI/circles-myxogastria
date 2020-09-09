const namespace = `circles-${process.env.NODE_ENV}`;

function getPath(key) {
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
  return getItem(key) !== null;
}

export function setItem(key, value) {
  return window.localStorage.setItem(getPath(key), value);
}

export function removeItem(key) {
  return window.localStorage.removeItem(getPath(key));
}
