import hasOwnProperty from 'shared/hasOwnProperty';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';

function hasValidKey(config) {
  return config.key !== undefined;
}

function hasValidRef(config) {
  return config.ref !== undefined;
}

/**
 * 内置
 * 不需要添加到 props 中
 */
const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

const ReactElement = (type, key, ref, self, source, props) => {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
  };

  return element;
};

export function jsxDEV(type, config, maybeKey, source, self) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;

  // 当显示声明 Key 时
  // 统一 <div key="Hi" {...props} />/<div {...props} key="Hi" />(props.key='hello') => key 为 Hi
  if (maybeKey !== undefined) {
    key = '' + maybeKey;
  }

  // 存在有效的 Key
  if (hasValidKey(config)) {
    key = '' + config.key;
  }
  if (hasValidRef(config)) {
    ref = config.ref;
  }

  for (propName in config) {
    if (
      hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName];
    }
  }

  // default props 处理
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return ReactElement(type, key, ref, undefined, undefined, props);
}
