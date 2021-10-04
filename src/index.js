import observer from '@cocreate/observer';

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
    let targetElements = document.querySelectorAll(targetSelector);
    for (let targetElement of targetElements) {
    	targetElement.elementConfig = getElementConfig(element);
    	targetElement.setAttribute('config', '');
    	console.log(targetElement, targetElement.elementConfig);
    }
}

function getElementConfig(element){
	let elementConfig = [];
	if (element.tagName == 'SCRIPT'){
		let configString = element.innerHTML.trim().substring(1).replace(/\];/g, ']').slice(0, -1);
	    let configItems = configString.replace(/},/g, '}},').split('},');
	    for( let item of configItems){
	        item = item.replace(/\s+/g, ' ').replace(/;/g, '').replace(/\*/g, '*').replace(/\"/g, '"').replace(/\'/g, "'").trim()
	        
	        var jsonStr = item.replace(/(\w+:)|(\w+ :)/g, function(s) {
	          return '"' + s.substring(0, s.length-1) + '":';
	        });
	        
	        var obj = JSON.parse(jsonStr);
	        console.log(obj); 
	        elementConfig.push(obj);
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
			elementConfig.push(configItem)
		}
	}
	return elementConfig.reverse();
}

	
function checkElementConfig(element, options, elementConfig){
	if (!elementConfig) 
		elementConfig =	element.ownerDocument.elementConfig;
	if (!elementConfig) 
		elementConfig =	element.closest('[config]');
	for(let config of configMatch(elementConfig, element)) {
		for(let option of options) {
			if(config[option] === true) {
				return true;
			}
			else return false;
		}
	}
}

function* configMatch(elementConfig, element) {
  for (let config of elementConfig) {
    // if (!Array.isArray(config.selector))
    //   config.selector = [config.selector];

    if (config.selector && element.matches(config.selector)) yield config;
  }
  return;
}
	

init();

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


export default {checkElementConfig, configMatch};