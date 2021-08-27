import { REACT_TEXT } from './constant';

const toString = (value) => Object.prototype.toString.call(value);

const isPlainObject = (value) => toString(value) === '[object Object]';

const isPlainString = (value) => toString(value) === '[object String]';

const isPlainNumber = (value) => toString(value) === '[object Number]';

export const isPlainFunction = (value) =>
	toString(value) === '[object Function]';

export const wrapTextNode = (value) => {
	if (isPlainString(value) || isPlainNumber(value)) {
		return {
			props: {
				content: value,
			},
			type: REACT_TEXT,
		};
	}
	return value;
};

export const isClassComponent = (childrenClass) => {
	return !!childrenClass.prototype.isReactComponent;
};
