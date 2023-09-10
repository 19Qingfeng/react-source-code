import { schedulerCallback } from "scheduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";

// 正在构建中的 FiberTree
let workInProgress;

/**
 * 调度更新 计划更新 Root
 * @param {*} root ReactFiberRootNode
 */
export function scheduleUpdateOnFiber(root) {
  // 确保调度执行 root 上的更新
  ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root) {
  // 告诉浏览器空闲时调度执行该函数，参数固定为 root
  schedulerCallback(performConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 执行 root 上的并发更新操作
 * 工作循环 - 构建 FiberTree
 */
function performConcurrentWorkOnRoot(root) {
  // 同步的方式渲染根节点 (初次渲染时，无论是否为并发 一定是同步的)
  renderRootSync(root);
}

/**
 * 构建 Fiber 树
 * @param {*} root
 */
function renderRootSync(root) {
  // 根据当前 current 初始化轮替的 fiber
  prepareFreshStack(root);
  // 同步的工作循环
  workLoopSync();
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
}

function workLoopSync() {
  if (workInProgress !== null) {
    // 执行工作单元
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  // 获取新 fiber 对应的旧的 fiber 节点 (当前的 current)
  const current = unitOfWork.alternate;
  const next = beginWork(current, unitOfWork);

  // 之后再看为什么 完成后，将 pendingProps 变为 memoizedProps 已经生效的
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  // 工作完成了
  if (next === null) {
    workInProgress = null;
    // completeUnitOfWork(unitOfWork);
  } else {
    // 让 beginWork 返回的子节点成为下一个工作单元
    workInProgress = next;
  }
}
