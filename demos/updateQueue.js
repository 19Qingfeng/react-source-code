// React 属性更新 双向链表指针 Demo

function initialUpdateQueue(fiber) {
  const queue = {
    shared: {
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

function createUpdate() {
  return {};
}

function enqueueUpdate(fiber, update) {
  // fiber 原有的更新队列
  const updateQueue = fiber.updateQueue;
  const shared = updateQueue.shared;
  const pending = shared.pending;

  if (pending === null) {
    // 队列为空
    update.next = update;
  } else {
    // 环状链表更改头尾指针
    update.next = pending.next; // 新插入的更新 next 永远会指向队列中第一个更新
    pending.next = update; // 同时让原有（原本最新的）更新的 next 指向本次（最新的）更新
  }

  shared.pending = update;
}

function updateFiberState(memoized, updater) {
  return Object.assign({}, memoized, updater.payload);
}

function processUpdateQueue(fiber) {
  const updateQueue = fiber.updateQueue;
  const shared = updateQueue.shared;
  const pending = shared.pending;
  if (!pending) {
    return;
  }

  shared.pending = null; // 将原有 fiber updateQueue 中的 pending（更新队列）重制为 null

  const lasterUpdate = pending; // 获取最后一个元素
  const firstUpdate = lasterUpdate.next; // 最后一个元素.next 即为第一次更新=》获取第一次 update
  lasterUpdate.next = null; // 将最后一次更新的 next 重制为 null（关闭环形链表）

  let updater = firstUpdate;
  let newState = fiber.memoizedState;
  while (updater) {
    newState = updateFiberState(newState, updater);
    // 使用payload更新
    updater = updater.next;
  }
  fiber.memoizedState = newState;
}

let fiber = { memoizedState: { id: 1 } };
initialUpdateQueue(fiber);

// 第一个更新（入队）
let update1 = createUpdate();
update1.payload = { name: "wang.haoyu", age: 26 };

// 第一个更新（入队）
let update2 = createUpdate();
update1.payload = { name: "19Qingfeng", loc: "ShangHai", hometown: "Xi'an" };

enqueueUpdate(fiber, update1);
enqueueUpdate(fiber, update2);

// 处理更新队列
processUpdateQueue(fiber);

console.log(fiber.memoizedState);
