// src/core/store.js
const KEY = "hexverse_store_v1";

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
}
function write(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj || {}));
}

export const Store = {
  set(name, value){
    const d = read();
    d[name] = value;
    write(d);
  },
  get(name, fallback=null){
    const d = read();
    return (name in d) ? d[name] : fallback;
  }
};
