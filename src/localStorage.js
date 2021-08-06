export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState == null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {}
};

export const removeState = () => {
  try {
    localStorage.removeItem("state");
  } catch (err) {}
};

export const loadNotAccess = () => {
  var serializedTryCount;
  try {
    serializedTryCount = localStorage.getItem("AccessTryCount");
    if (serializedTryCount == null) {
      serializedTryCount = JSON.stringify({ attempt: 1 });
      localStorage.setItem("AccessTryCount", serializedTryCount);
    } else {
      serializedTryCount = JSON.parse(serializedTryCount);
      serializedTryCount.attempt = serializedTryCount.attempt + 1;
      serializedTryCount = JSON.stringify(serializedTryCount);
      localStorage.setItem("AccessTryCount", serializedTryCount);
    }
    return JSON.parse(serializedTryCount);
  } catch (err) {
    serializedTryCount = JSON.stringify({ attempt: 1 });
    localStorage.setItem("AccessTryCount", serializedTryCount);
    return JSON.parse(serializedTryCount);
  }
};

export const removeNotAccess = () => {
  try {
    localStorage.removeItem("AccessTryCount");
  } catch (err) {}
};
