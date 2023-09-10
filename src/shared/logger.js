import * as ReactWorkTags from "react-reconciler/src/ReactWorkTags";

const ReactWorkTagsMap = new Map();

for (let tag in ReactWorkTags) {
  ReactWorkTagsMap.set(ReactWorkTags[tag], tag);
}

/**
 * 打印 Fiber 信息
 * @param {*} prefix
 * @param {*} workInProgress
 */
export default function (prefix, workInProgress) {
  let tagValue = workInProgress.tag;
  let tagName = ReactWorkTagsMap.get(tagValue);

  let str = `${tagName}`;

  if (tagName === "HostComponent") {
    // 源生节点 加上标签
    str + `${workInProgress.type}`;
  } else if (tagName === "HostText") {
    str + `${workInProgress.pendingProps}`;
  }

  console.log(`${prefix} ${str}`);
}
