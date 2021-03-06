import { isPlainFunction } from '../utils';
import { compareToVDom, findDOM } from './react-dom';

/**
 * 实现思路
 * React在事件处理函数中默认会将isBatchUpdating改成true 表示批量更新
 * 之后如果是批量更新 我们对于state的修改就应该缓存起来 将updater实例缓存在updaters
 * 当事件处理函数结束之后 同步执行batchUpdate函数 batchUpdate方法执行批量更新
 * 然后再将isBatchUpdating重置为false
 */

// 控制批量更新
export const updateQueue = {
	isBatchUpdating: false,
	updaters: new Set(),
	// 批量更新方法
	batchUpdate() {
		for (let updater of updateQueue.updaters) {
			updater.updateComponent();
		}
		updateQueue.isBatchUpdating = false;
		updateQueue.updaters.clear();
	},
};

// 专门管理更新调度逻辑
class Updater {
	constructor(classInstance) {
		this.classInstance = classInstance;
		// state队列
		this.pendingState = [];
		// callback队列
		this.callbacks = [];
	}

	// 更新状态
	addState(partialState, callback) {
		this.pendingState.push(partialState);
		if (isPlainFunction(callback)) {
			this.callbacks.push(callback);
		}
		this.emitUpdate();
	}

	// props/state变化触发更新
	emitUpdate(nextProps) {
		if (updateQueue.isBatchUpdating) {
			// 批量更新
			updateQueue.updaters.add(this);
		} else {
			// 非批量更新
			this.updateComponent(nextProps);
		}
	}

	// 让组件更新
	updateComponent(nextProps) {
		const { classInstance, pendingState } = this;
		// 存在等待更新
		if (pendingState.length > 0) {
			// 让组件进行更新
			shouldUpdate(classInstance, nextProps, this.getState());
		}
	}

	// 获取当前state
	getState() {
		let { state } = this.classInstance; // old State
		const { pendingState } = this; // new State
		pendingState.reduce((preState, newState) => {
			if (isPlainFunction(newState)) {
				state = { ...preState, ...newState(preState) };
			} else {
				state = { ...preState, ...newState };
			}
		}, state);
		// 这里应该是页面渲染后在调用callbacks 这里先暂时放在这里
		this.callbacks.forEach((cb) => {
			cb();
		});
		// 清空
		pendingState.length = 0;
		this.callbacks.length = 0;
		return state;
	}
}

// 决定instance是否更新
function shouldUpdate(instance, nextProps, nextState) {
	let willUpdate = true
	if (instance.shouldComponentUpdate && !instance.shouldComponentUpdate(nextProps, nextState)) {
		willUpdate = false
	}

	// 更新前的生命周期
	if (willUpdate && instance.componentWillUpdate) {
		instance.componentWillUpdate()
	}

	// 内部真正修改实例的state 无论是否更新都会修改组件的state/props
	if (nextProps) instance.props = nextProps
	instance.state = nextState;
	if (willUpdate) {
		instance.forceUpdate();
	}
}

class Component {
	constructor(props) {
		this.props = props;
		this.state = {};
		// 每一个类组件的实例 存在一个Updater更新器去调度state的更新
		this.update = new Updater(this);
	}
	setState(partialState, callback) {
		// component这个类内部并不存在更新调度逻辑 它只是管理更新组件
		// 注意之前讲过 callback是在页面渲染之后执行
		// 这里通过调用父组件的setState才会进入一系列的逻辑从而触发组件渲染
		// 直接修改state并不会走到这里的逻辑
		// 这也就是为什么会setState触发页面渲染
		this.update.addState(partialState, callback);
	}
	/**
	 * 1. 获取老的虚拟DOM元素
	 * 2. 根据最新的state和props生成最新的虚拟DOM
	 * 3. 进行比较,查找他们之间的差异。
	 * 4. 同步差异内容进行更新而不是全量更新。
	 * 5. 这里我们并不实现DOMDiff 先直接替换children节点
	 *
	 * 每次setState导致state变化，对应组件需要更新，都会进入forceUpdate。
	 * 这个函数经历的步骤
	 * 1. 获取当前class组件在页面上挂载的真实DOM元素   oldDOM节点
	 * 2. 获取当前class组件在页面上挂载的真实DOM元素的父元素  oldDom.parent节点
	 * 3. 获取当前组件的renderVDom对象 -- oldRenderVDom对象
	 * 4. 获取state变化后重新调用render()方法的renderVDom对象 -- newRenderVDom对象
	 * 5. 通过之前写的React.createDom(newRenderVDom) -- 获得新的应该挂载的newDom对象
	 * 6. oldDom.parentDom.replaceChild(newDom,oldDom) 替换节点进行刷新
	 * > 这里并没有进行Dom-diff，先简单粗暴的替换更新的组件元素
	 */
	forceUpdate() {
		const oldRenderVDom = this.oldRenderVDom;
		const newRenderVDom = this.render();
		// 真实挂载DOM节点
		const parentDom = findDOM(oldRenderVDom).parentNode;
		// diff算法 比较差异 将差别更新到真实DOM上
		compareToVDom(parentDom, oldRenderVDom, newRenderVDom);
		// 更新实例上vDom属性为最新的 注意这里是renderVDom
		this.oldRenderVDom = newRenderVDom;
		/* 生命周期 更新完成 */
		if (this.componentDidUpdate) {
			this.componentDidUpdate(this.props, this.state)
		}
	}
}

/* 
	区分FC和Class Component的区别
	源码中ClassComponent prototype中存在isReactComponent
	class组件子元素可以通过此属性鉴别是否是ClassComponent
*/

Component.prototype.isReactComponent = {};

export default Component;
