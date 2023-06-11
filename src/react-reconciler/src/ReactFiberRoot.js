function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo;
}

/**
 *
 * @param {*} containerInfo Dom 节点
 * @returns
 */
export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  return root;
}
