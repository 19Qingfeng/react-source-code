import { isPlainFunction } from '../utils';

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
	emitUpdate() {
		// 这里后来会添加批量更新的判断 判断是否是批量更新
		this.updateComponent();
	}

	// 让组件更新
	updateComponent() {
		const { classInstance, pendingState } = this;
		// 存在等待更新
		if (pendingState.length > 0) {
			// 让组件进行更新
			shouldUpdate(classInstance, this.getState());
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
function shouldUpdate(instance, state) {
	instance.state = state; // 内部真正修改实例的state
	// 调用实例的方法进行重新渲染
	instance.updateComponent();
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
	// 重新渲染实例组件
	updateComponent() {
		console.log(this.state, '更新后的state');
		this.render();
		console.log('updateComponent');
	}
}

/* 
  区分FC和Class Component的区别
  源码中ClassComponent prototype中存在isReactComponent
  class组件子元素可以通过此属性鉴别是否是ClassComponent
*/

Component.prototype.isReactComponent = {};

export default Component;
