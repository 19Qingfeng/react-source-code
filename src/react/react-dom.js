import { isPlainFunction, isClassComponent } from '../utils';
import { REACT_TEXT } from '../utils/constant';
import { addEvents } from './events';
function render(vDom, el) {
	const dom = createDom(vDom);
	el.appendChild(dom);
}

// 将vDom转化成为真实Dom
function createDom(vDom) {
	const { type, props, ref } = vDom;
	let dom;
	if (type == REACT_TEXT) {
		dom = document.createTextNode(props.content);
	} else if (isPlainFunction(type)) {
		if (isClassComponent(type)) {
			return mountClassComponent(vDom);
		} else {
			return mountFunctionComponent(vDom);
		}
	} else {
		dom = document.createElement(type);
	}
	// 更新props
	if (props) {
		updateProps(dom, {}, props);
		// 更新children
		if (props.children) {
			// 更新递归调用children
			if (Array.isArray(props.children)) {
				reconcileChildren(props.children, dom);
			} else {
				render(props.children, dom);
			}
		}
	}
	// 虚拟DOM上的dom属性指向真实dom 这里只有renderVDom才会挂载dom
	vDom.dom = dom;
	// 赋值Ref 属性上存在ref，那么在每次创建完成真实DOM后,将对应真实Dom元素赋值给ref.current
	if (ref) {
		ref.current = dom;
	}
	return dom;
}

// 多个children进行
function reconcileChildren(vDoms, el) {
	vDoms.forEach((vDom) => {
		render(vDom, el);
	});
}

// 挂载ClassComponent
function mountClassComponent(vDom) {
	// 这里应该可以拿到ref 类组件的ref是类的实例对象
	const { type, props, ref } = vDom;
	const instance = new type(props);
	if (instance.componentWillMount) {
		instance.componentWillMount()
	}
	if (ref) {
		// 如果ref属性存在 类的实例赋值给ref.current
		ref.current = instance;
	}
	const renderVDom = instance.render();
	if (instance.componentDidMount) {
		instance.componentDidMount()
	}
	// 考虑根节点是class组件 所以 vDom.oldRenderVDom = renderVDom
	instance.oldRenderVDom = vDom.oldRenderVDom = renderVDom; // 挂载时候给类实例对象上挂载当前RenderVDom
	return createDom(renderVDom);
}

// 挂载FunctionComponent
function mountFunctionComponent(vDom) {
	const { type, props, ref } = vDom;
	// 这里存在
	const renderDom = type(props, ref);
	// 考虑根节点是FunctionComponent
	vDom.oldRenderVDom = renderDom;
	const dom = createDom(renderDom);
	return dom;
}

// 更新props
function updateProps(dom, oldProps, newProps) {
	Object.keys(newProps).forEach((key) => {
		if (key === 'children' || key === 'content') {
			return;
		}
		// 处理事件 之后会使用合成事件和事件委托 之后会渐进式处理的
		if (key === 'style') {
			addStyleToElement(dom, newProps[key]);
		} else if (key.startsWith('on')) {
			addEvents(dom, key.toLocaleLowerCase(), newProps[key]);
			// addEventToElement(dom, key.toLocaleLowerCase(), newProps[key]);
		} else {
			dom[key] = newProps[key];
		}
	});
}

// 事件绑定
function addEventToElement(dom, eventName, eventHandler) {
	const lowerEventName = eventName.toLowerCase();
	dom[lowerEventName] = eventHandler;
}

// 样式处理
function addStyleToElement(dom, styleObject) {
	Object.keys(styleObject).forEach((key) => {
		const value = styleObject[key];
		dom.style[key] = value;
	});
}

/**
 * 真实源码中非常复杂
 * 简化下根据VDom返回真实Dom节点
 * 需要额外注意的是 如果renderVDom是class或者Function那么他并不是真实的渲染节点 继续递归查找
 * 如果是普通Dom节点 直接返回挂载的dom属性
 * @param {*} vdom
 */
export function findDOM(vDom) {
	const { type } = vDom;
	if (typeof type === 'function') {
		// 非普通DOM节点 是class组件或者functionComponent
		return findDOM(vDom.oldRenderVDom);
	} else {
		return vDom.dom;
	}
}

/**
 * Dom-diff比较更新 (暂时不实现)
 * 将更新同步到真实Dom上 (强行replace)
 */
export function compareToVDom(parentDom, oldVDom, newVDom) {
	const oldDom = findDOM(oldVDom);
	const newDom = createDom(newVDom);
	parentDom.replaceChild(newDom, oldDom);
}

const ReactDOM = {
	render,
};

export default ReactDOM;
