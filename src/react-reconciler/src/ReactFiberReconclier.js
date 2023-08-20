import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 *
 * @param {*} element 虚拟 Dom
 * @param {*} container 真实 Dom 容器
 */
export function updateContainer(element, container) {
  const current = container.current; // fiberNode
  const update = createUpdate();
  update.payload = { element };
  enqueueUpdate(current, update);
  return markUpdateLaneFromFiberToRoot(fiber);
}
