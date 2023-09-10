import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

/**
 * 创建容器
 * @param {*} containerInfo 真实 Dom 容器 <div id='root'></div>
 * @returns
 */
export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo); // 创建 fiber 的根节点
}

/**
 *
 * @param {*} element 虚拟 Dom
 * @param {*} container 真实 Dom 容器(fiberRootNode)
 */
export function updateContainer(element, container) {
  const current = container.current; // fiberNode
  const update = createUpdate(); // 创建更新
  update.payload = { element };
  const root = enqueueUpdate(current, update); // 将更新入队
  // 开启更新
  scheduleUpdateOnFiber(root);
  // return root;
}
