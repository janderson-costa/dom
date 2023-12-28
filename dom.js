/*
	dom - Criado por Janderson em 28/12/2024.

	Descrição: Um jQuery simplificado.

	Funções:
		.create()
		.createFromHTML()

		Elemento(s) selecinado:
			.get()
			.getById()
			.getByAttr()
			.getByClass()
			.val()
			.html()
			.text()
			.attr()
			.css()
			.addClass()
			.removeClass()
			.show()
			.hide()
			.resizeOnInput()

	Observações:
		- Argumentos internos que o usuário não precisa iniformar: todos os precedidos por '__'.
*/

function dom(selectorOrElement, __node = document) {
	if (selectorOrElement) {
		const element =
			_isString(selectorOrElement) ? __node.querySelectorAll(selectorOrElement) :
			_isHTMLElement(selectorOrElement) ? selectorOrElement : null;

		if (element) {
			if (!element.configured)
				addFunctions(element);

			if (_isNodeList(element)) {
				element.forEach(element => {
					if (!element.configured)
						addFunctions(element);
				});

				return element.length > 1 ? element : element[0];
			}

			return element;
		}
	}

	return {
		create,
		createFromHTML
	};


	// FUNÇÕES

	function addFunctions(element) {
		// Extende novas funções além das nativas.

		element.get = selector => get(selector, element);
		element.getById = id => get('#' + id, element);
		element.getByAttr = (attribute, value) => get(`[${attribute}${value != undefined ? '="' + value + '"' : ''}]`, element);
		element.getByClass = className => get('.' + className, element);
		element.val = _value => val(_value, element);
		element.html = _html => html(_html, element);
		element.text = _text => text(_text, element);
		element.attr = props => _setProperty(props, element);
		element.css = style => _setProperty({ style: style }, element);
		element.addClass = (className, add) => addClass(className, add, element);
		element.removeClass = (className, add) => removeClass(className, add, element);
		element.show = (_show, display) => show(_show, display, element);
		element.hide = _hide => hide(_hide, element);
		element.resizeOnInput = element => resizeOnInput(element);
		element.on = (eventName, _function) => on(eventName, _function, element);

		element.configured = true;
	}

	function create(tagName) {
		return document.createElement(tagName);
	}

	function createFromHTML(html) {
		const element = create('div');

		element.innerHTML = html;

		return element.firstChild;
	}

	function get(selector, __node) {
		const elements = [];

		_toList(__node).forEach(node => {
			const element = dom(selector, node);

			if (element) {
				(_isNodeList(element) ? element : [element]).forEach(element =>
					elements.push(element)
				);
			}
		});

		if (elements.length)
			addFunctions(elements);

		return elements.length > 1 ? elements : elements.length == 1 ? elements[0] : undefined;
	}

	function val(value, __element) {
		const isUndefined = _isUndefined(value);
		const values = [];

		_toList(__element).forEach(element => {
			if (!isUndefined)
				element.value = value; // set
			else
				values.push(element.value); // get
		});

		if (isUndefined)
			return values.length > 1 ? values : values[0];
		else
			return __element; 
	}

	function findAscendent() {
		//..
	}

	function show(show = true, display = '', __element) {
		return _setProperty({
			style: {
				display: show ? display : 'none'
			}
		}, __element);
	}

	function hide(hide = true, __element) {
		return show(!hide, '', __element);
	}

	function html(html, __element) {
		return _setProperty({ innerHTML: html }, __element);
	}

	function text(text, __element) {
		return _setProperty({ innerText: text }, __element);
	}

	function addClass(className, add = true, __element) {
		// className: string/[string]

		if (!_isNullOrUndefined(className)) {
			className = _toList(className);

			_toList(__element).forEach(element => {
				className.forEach(className =>
					element.classList[add ? 'add' : 'remove'](className)
				);
			});
		}

		return __element;
	}

	function removeClass(className, remove = true, __element) {
		addClass(className, !remove, __element)
	}

	function resizeOnInput(textarea) {
		// Somente para textarea.

		_toList(textarea).forEach(textarea => {
			if (textarea instanceof HTMLTextAreaElement) {
				//..
			}
		});
	}

	function on(eventName, _function, __element) {
		_toList(__element).forEach(element => {
			element.addEventListener(eventName, _function);
		});
	}


	// INTERNO

	function _setProperty(props = {}, __element) {
		if (!_isNullOrUndefined(props))
			_toList(__element).forEach(element => {
				for (const key in props) {
					const value = props[key];

					if (key == 'style') {
						if (!_isEmpty(value)) {
							const style = value;

							for (const key in style) {
								element.style[key] =  style[key];
							}
						} else {
							element.removeAttribute(key);
						}
					} else {
						element[key] = value;
					}
				}
			});

		return __element;
	}

	function _isNull(value) {
		return value == null;
	}

	function _isUndefined(value) {
		return typeof value == 'undefined';
	}

	function _isEmpty(value) {
		return value == '';
	}

	function _isNullOrUndefined(value) {
		return _isNull(value) || _isUndefined(value);
	}

	function _isNullOrUndefinedOrEmpty(value) {
		return _isNull(value) || _isUndefined(value) || _isEmpty(value);
	}

	function _isString(element) {
		return typeof element == 'string';
	}

	function _isHTMLElement(element) {
		return element instanceof HTMLElement;
	}

	function _isNodeListOrArray(element) {
		return  _isNodeList(element) || _isArray(element);
	}

	function _isNodeList(element) {
		return element instanceof NodeList;
	}

	function _isArray(element) {
		return element instanceof Array;
	}

	function _toList(element) {
		return _isNodeListOrArray(element) ? element : [element];
	}
}