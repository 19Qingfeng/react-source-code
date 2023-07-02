import { HostRoot } from "./ReactWorkTags";
import { NoFlags } from "./ReactFiberFlags";

/**
 * 创建 Fiber
 * @param {*} tag Fiber 的类型，比如 FC、Class Component、源生 HTML 标签等
 * @param {*} pendingProps 新属性，等待处理/生效的属性
 * @param {*} key 唯一标识
 */
function FiberNode(tag, pendingProps, key) {
  this.tag = tag; // 标签的类型
  this.key = key;
  this.type = null; // Fiber 的类型，比如 span、Suspense、div 等
  // VDom => FiberNode => Real DomNode
  this.stateNode = null; // 该 Fiber 对应的真实 Dom 节点

  this.return = null; // 父节点
  this.child = null; // 儿子节点
  this.sibling = null; // 弟弟节点（同级别下一个）

  // fiber 是通过 VDom 创建而来的，VDom 会提供 pendingProps 用来创建 Fiber 节点的属性
  this.pendingProps = pendingProps; // 等待生效的属性
  this.memoizedProps = null; // 已经生效的属性

  // 每一种 fiber 的状态是不一样的
  // 比如 class component 存储的就是类的实例（状态）, HostRoot 存放的就是渲染的 Dom 元素
  this.memoizedState = null; // Fiber 的状态

  // 每个 Fiber 可能存在的更新队列（比如调用 setState 时后续需要更新的数据）
  this.updateQueue = null;

  // Flags 二进制方式标识元素是否具有副作用
  this.flags = NoFlags; // 副作用标识，表示根据该 fiber 节点进行何种操作
  // 子节点对应的副作用标识
  this.subTreeFlags = NoFlags;
  // 替身，双缓冲模型
  this.alternate = null;
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

// 存放创建 Fiber 的方法
export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}
