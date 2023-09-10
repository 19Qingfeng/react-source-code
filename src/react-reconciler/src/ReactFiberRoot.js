import { createHostRootFiber } from "./ReactFiber";
import { initialUpdateQueue } from "./ReactFiberClassUpdateQueue";

/**
 * 类似于真实 Dom 节点（进行了简单的包装）
 * @param {*} containerInfo
 */
function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo;
}

/**
 *
 * @param {*} containerInfo Dom 节点
 * @returns
 */
export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo); // root 的本质和 fiber 没关系，它内部通过 containerInfo 指向真实 Dom 节点
  // 创建根 fiber 这里是是真实 Fiber
  const uninitializedFiber = createHostRootFiber();
  // 将根容器的 current 指向根 fiber
  root.current = uninitializedFiber;
  // 将根 fiber 的 stateNode 属性，指向根容器(root)
  uninitializedFiber.stateNode = root;
  // 为该 Fiber 添加初始化更新队列
  initialUpdateQueue(uninitializedFiber);
  return root;
}
