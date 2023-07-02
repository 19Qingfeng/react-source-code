export function initialUpdateQueue(fiber) {
  // 创建新的更新队列
  const queue = {
    shared: {
      pending: null, // 等待生效的队列（循环链表）
    },
  };
  fiber.updateQueue = queue;
}
