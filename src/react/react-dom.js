import { isPlainFunction, isClassComponent } from '../utils';
import { REACT_TEXT } from '../utils/constant';

function render(vDom, el) {
	const dom = createDom(vDom);
	el.appendChild(dom);
}

// 将vDom转化成为真实Dom
function createDom(vDom) {
	const { type, props } = vDom;
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
	const { type, props } = vDom;
	const dom = createDom(new type(props).render());
	return dom;
}

// 挂载FunctionComponent
function mountFunctionComponent(vDom) {
	const { type, props } = vDom;
	const dom = createDom(type(props));
	return dom;
}

// 更新props
function updateProps(dom, oldProps, newProps) {
	Object.keys(newProps).forEach((key) => {
		if (key === 'children' || key === 'content') {
			return;
		}
		// 处理事件
		if (key === 'style') {
			addStyleToElement(dom, newProps[key]);
		} else if (key.startsWith('on')) {
			addEventToElement(dom, key, newProps[key]);
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

const ReactDOM = {
	render,
};

export default ReactDOM;
