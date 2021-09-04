import { updateQueue } from './component';
/**
 * 实现事件委托，将所有的事件劫持绑定在根元素上
 * @export
 * @param {*} dom 事件元素
 * @param {*} eventName 事件名称
 * @param {*} eventHandler 事件函数
 */
export function addEvents(dom, eventName, eventHandler) {
	// 为该元素挂载对应事件属性
	let store = dom.store ? dom.store : (dom.store = {});
	store[eventName] = eventHandler;
	if (!document[eventName]) {
		// 如果有很多个相同事件 比如click
		// 那么事件委托的时候 仅仅委托一次处理
		document[eventName] = dispatchEvent;
	}

	function dispatchEvent(event) {
		let { target, type } = event;
		const eventType = `on${type}`;
		// 合成时间tart
		const syntheticEvent = createSynthetic(target);
		// 开启批量更新
		updateQueue.isBatchUpdating = true;
		// 实现事件处理器调用 注意事件冒泡实现
		while (target) {
			const { store } = target;
			const eventHandler = store && store[eventType];
			// 执行事件处理函数
			eventHandler && eventHandler.call(target, syntheticEvent);
			// 递归冒泡
			target = target.parentNode;
		}
		// 关闭批量更新标志位
		updateQueue.isBatchUpdating = false;
		// 进行批量更新
		updateQueue.batchUpdate();
	}
}

// 合成事件target 源码中额外做了各种事件兼容性处理
function createSynthetic(target) {
	const result = {};
	Object.keys(target).forEach((key) => {
		result[key] = target[key];
	});
	return result;
}
