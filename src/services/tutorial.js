import { getItem, hasItem, removeItem, setItem } from '~/services/storage';

const TUTORIALS_KEY_NAME = 'tutorials';

function getTutorials() {
  if (!hasItem(TUTORIALS_KEY_NAME)) {
    setItem(TUTORIALS_KEY_NAME, JSON.stringify({}));
  }

  return JSON.parse(getItem(TUTORIALS_KEY_NAME));
}

function setTutorials(tutorials) {
  setItem(TUTORIALS_KEY_NAME, JSON.stringify(tutorials));
}

export function resetTutorials() {
  removeItem(TUTORIALS_KEY_NAME);
}

export function getTutorial(name) {
  const tutorials = getTutorials();

  if (!(name in tutorials)) {
    return false;
  }

  return tutorials[name];
}

export function setTutorial(name, isFinished) {
  const tutorials = getTutorials();
  tutorials[name] = isFinished;

  setTutorials(tutorials);
}
