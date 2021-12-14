import observer from '@cocreate/observer';
import {hasSelection} from '@cocreate/selection';

function init() {
    let elements = document.querySelectorAll('[config-target]');
    initElements(elements);
}

function initElements(elements) {
    for(let element of elements)
        initElement(element);
}

function initElement(element) {
	let targetSelector = element.getAttribute('config-target');
	if (!targetSelector) return;
	let targetDocument = document;

	if(targetSelector.indexOf(';') !== -1) {
		let documentSelector;
		[documentSelector, targetSelector] = targetSelector.split(';');
		let frame = document.querySelector(documentSelector);
		if (frame)
		 	targetDocument = frame.contentDocument;
	}
    let targetElements = targetDocument.querySelectorAll(targetSelector);
    for (let targetElement of targetElements) {
    	targetElement.elementConfig = getElementConfig(element);
    	targetElement.setAttribute('config', '');
    }
}

function getElementConfig(element){
	let elementConfig = [];
	if (element.tagName == 'SCRIPT'){
		let configString = element.innerHTML.trim().substring(1).replace(/\];/g, ']').slice(0, -1);
	    let configItems = configString.replace(/},/g, '}},').split('},');
	    for( let item of configItems){
	        item = item.replace(/\s+/g, ' ').replace(/;/g, '').replace(/\*/g, '*').replace(/\"/g, '"').replace(/\'/g, "'").trim();
	        if(item) {
		        var jsonStr = item.replace(/(\w+:)|(\w+ :)/g, function(s) {
		          return '"' + s.substring(0, s.length-1) + '":';
		        });
		        
		        var obj = JSON.parse(jsonStr);
	        elementConfig.push(obj);
	        }
	    }
	}
	else {
		let children = element.children;
		for (let child of children) {
			let attributes = child.attributes;
			let configItem = {};
			for (let attribute of attributes) {
				configItem[attribute.name] = attribute.value;
			}
			elementConfig.push(configItem);
		}
	}
	return elementConfig.reverse();
}

	
export function checkElementConfig(element, options, elementConfig){
	let configedEl;
	if (!elementConfig){
		if (element.ownerDocument.elementConfig) {
			elementConfig =	element.ownerDocument.elementConfig;
			configedEl = element.ownerDocument;
		}
		else if(element.ownerDocument.documentElement.elementConfig) {
			elementConfig =	element.ownerDocument.documentElement.elementConfig;
			configedEl = element.ownerDocument.documentElement;
		}
		else {
			configedEl = element.closest('[contenteditable]');
			if(configedEl)
				elementConfig =	configedEl.elementConfig;
			else return;
		}
	}
	for(let config of configMatch(elementConfig, element)) {
		for(let option of options) {
			if (option == 'editable') {
				if(config[option] == true || config[option] == 'true') {
					if (hasSelection(element) && element.closest('[contenteditable="true"]'))
						return true;
					else return;
				}
			}
			else if(config[option] == true || config[option] == 'true') {
				return config;
			}
			// else if (config[option]){
			// 	var func = new Function(config[option]);
			// 	if (func(element, option))
			// 		return true;
			// }
			else if (config[option] == 'function'){
				if (configedEl.configFunctions[option](element, option))
					return true;
			}
			else return false;
		}
	}
}

export function* configMatch(elementConfig, element) {
  for (let config of elementConfig) {
    // if (!Array.isArray(config.selector))
    //   config.selector = [config.selector];

    if (config.selector && element.matches(config.selector)) yield config;
  }
  return;
}
	
observer.init({
    name: 'CoCreateAddedNodes',
    observe: ['addedNodes'],
    target: '[config-target]',
    callback (mutation) {
        initElement(mutation.target);
    }
});

observer.init({
    name: 'CoCreateAddedNodes',
    observe: ['attributes'],
    target: '[config-target]',
    callback (mutation) {
        initElement(mutation.target);
    }
});

observer.init({
    name: 'CoCreateAddedNodes',
    observe: ['childList'],
    target: '[config-target]',
    callback (mutation) {
        initElement(mutation.target);
    }
});

observer.init({
    name: 'CoCreateAddedNodes',
    observe: ['addedNodes'],
    target: 'config',
    callback (mutation) {
        initElement(mutation.target.parentElement);
    }
});

observer.init({
    name: 'CoCreateAddedNodes',
    observe: ['attributes'],
    target: 'config',
    callback (mutation) {
        initElement(mutation.target.parentElement);
    }
});

init();

export default {checkElementConfig, configMatch};