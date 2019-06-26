import $            from 'jquery';
import {
	url_git_list_consumers,
	url_new_consumer,
	url_edit_consumer,
	url_delete_consumer
}                   from '../config';
import {isjQuery}   from '../utilities/assertion';
import handlerError from '../utilities/handlerError';
import 'magnific-popup';
import 'magnific-popup/dist/magnific-popup.css'
import {
	validationName,
	validationNumber
}                   from '../utilities/validation.js';
import {sortObject} from '../utilities/sort';

// основное тело программы
$(function () {
	// Контейнер для построения списка потребителей
	const $consumers_list = $('.consumers-list');
	if (!$consumers_list.length) {
		handlerError('Не найден HTMLElement для построения списка потребителей. Завершение работы программы.');
		return;
	}

	// запрос к серверу для получения списка потребителей
	callServer.getListConsumers(url_git_list_consumers)
		.done(function (data_from_sever, textStatus, jqXHR) {
			try {
				// выстраиваем список потребителей
				buildConsumersList($consumers_list, data_from_sever);

				const $document = $(document);

				// событие на нажатие кнопки редактирования потребителя
				$document.on('click', '.consumers-list__edit-btn', function () {
					editConsumerItem($(this).closest('.consumers-list__item'));
				});

				// событие на нажатие кнопки удаления
				$document.on('click', '.consumers-list__delete-btn', function () {
					deleteConsumerItem($(this).closest('.consumers-list__item'));
				});

				// событие на добавление нового потребителя
				$document.on('click', '.consumers-list__add-btn', function () {
					newConsumerItem($(this).closest('.consumers-list__item'));
				});

				// событие на нажатие кнопки сортировки
				$('.consumers-list__sort').on('click', function () {
					sortConsumersList($(this), $consumers_list)
				});
			} catch (error) {
				handlerError(error.message);
			}
		});
});


/**
 * Объект методов для работы с сервером
 */
const callServer = {
	/**
	 * Метод производит запрос на сервер, для получения списка потребителей
	 * @param url {string} - адрес API для получения списка потребителей
	 * @return {jQuery.ajax} - объект ajax запроса
	 */
	getListConsumers(url) {
		return $.ajax({
			url: url,
			type: 'get',
			dataType: 'json'
		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR)
			handlerError(`Ошибка при обращении в серверу: ${url}`);
		})
	},

	/**
	 * Метод производит запрос на сервер, для получения объекта с id нового потребителя
	 * @param url {string} - адрес API для получения id нового потребителя
	 * @return {jQuery.ajax} - объект ajax запроса
	 */
	newConsumer(url) {
		return $.ajax({
			url: url,
			type: 'get',
			dataType: 'json'
		}).fail(function (jqXHR, textStatus, errorThrown) {
			handlerError(`Ошибка при обращении в серверу: ${url}`);
		})
	},

	/**
	 * Метод производит запрос на сервер, для получения объекта с id нового потребителя
	 * @param url {string} - адрес API для получения id нового потребителя
	 * @param data_consumer {object} - объект с данными для нового потребителя
	 * @param data_consumer.id {number} - идентификатор позиции
	 * @param data_consumer.name {string} - имя потребителя
	 * @param data_consumer.type {number} - тип потребителя 1 - физическое лицо и 2 - юридическое лицо
	 * @param data_consumer.key {number} - номер потребителя
	 * @return {jQuery.ajax} - объект ajax запроса
	 */
	editConsumer(url, data_consumer) {
		return $.ajax({
			url: url,
			type: 'get',
			dataType: 'json',
			data: {
				id: data_consumer.id,
				name: data_consumer.name,
				type: data_consumer.type,
				key: data_consumer.key
			}
		}).fail(function (jqXHR, textStatus, errorThrown) {
			handlerError(`Ошибка при обращении в серверу: ${url}`);
		})
	},

	/**
	 * Метод производит запрос на сервер, для удаления потребителя
	 * @param url {string} - адрес API для удаления потребителя
	 * @param id_consumer - {number} - идентификатор позиции
	 * @return {jQuery.ajax} - объект ajax запроса
	 */
	deleteConsumer(url, id_consumer) {
		return $.ajax({
			url: url,
			type: 'get',
			dataType: 'json',
			data: {
				id: id_consumer
			}
		}).fail(function (jqXHR, textStatus, errorThrown) {
			handlerError(`Ошибка при обращении в серверу: ${url}`);
		})
	}
};

/**
 * Функция выстраивает список потребителей.
 * @param $list_container {_jQuery} - контейнер, внутри которого будут выстроен список потребителей.
 * @param data_consumers {array} - объект с данными о потребителях
 * @param data_consumers[].id {number} - идентификатор позиции
 * @param data_consumers[].name {string} - имя потребителя
 * @param data_consumers[].type {number} - тип потребителя 1 - физическое лицо и 2 - юридическое лицо
 * @param data_consumers[].key {number} - номер потребителя
 * @return {boolean}
 */
function buildConsumersList($list_container, data_consumers) {
	// проверка, что передан не пустой объект jQuery
	if (!(isjQuery($list_container) && $list_container.length)) {
		return false;
	}
	let html = '';

	try {
		if (!data_consumers.length) {
			// todo обработка ситуации, когда список пуст
		} else {
			html += `<div class="consumers-list__head clearfix">
					<div class="consumers-list__edit">Редакт.</div>
					<div class="consumers-list__name">ФИО</div>
					<div class="consumers-list__delete">Удалить</div>
					<div class="consumers-list__key">Номер потребителя</div>
					<div class="consumers-list__type consumers-list__type_head" title="Ф - физическое / Ю - юридическое лицо ">
						<div class="consumers-list__type-text">Тип</div>
						<div class="consumers-list__sort"></div>
					</div>
				</div>`;

			// построение тела списка потребителей
			data_consumers.forEach(function (data_consumer, index_consumer, list_consumers) {
				const id = data_consumer.id;
				const name = data_consumer.name;
				const key = data_consumer.key;
				const type = data_consumer.type;
				const type_text = type === 1 ? "Ф" : "Ю";
				const type_toggle = type === 1 ? "Физическое лицо" : "Юридическое лицо";

				html += `<div class="consumers-list__item clearfix" data-id="${id}">
						<div class="consumers-list__edit">
							<span class="consumers-list__edit-btn btn btn-info">Редакт.</span>
						</div>
						<div class="consumers-list__name">${name}</div>
						<div class="consumers-list__delete">
							<span class="consumers-list__delete-btn btn btn-danger">Удалить</span>
						</div>
						<div class="consumers-list__key">${key}</div>
						<div class="consumers-list__type" title="${type_toggle}" data-type="${type}">
							<span class="consumers-list__type-text">${type_text}</span>
							<span class="consumers-list__help">?
								<span class="consumers-list__help-toggle">${type_toggle}</span>
							</span>
						</div>
					</div>`;
			});

			html += `<div class="consumers-list__add">
					<span class="consumers-list__add-btn btn btn-primary">Добавить пользователя </span>
				</div>`;

			$list_container.html(html)
		}
	} catch (error) {
		console.error(error)
	}
}


/**
 * Редактирование потребителя
 * @param $consumers_item {jQuery} - объект строки потребителя из списка
 */
function editConsumerItem($consumers_item) {
	const id = $consumers_item.data('id');
	const name = $consumers_item.find('.consumers-list__name').text();
	const type = parseInt($consumers_item.find('.consumers-list__type').data('type'), 10);
	const key = $consumers_item.find('.consumers-list__key').text();
	const title = 'Редактирование потребителя';

	// построение формы редактирования потребителя
	const $consumers_form = buildPopup({id, name, type, key, title});

	// функция, которая будет отрабатывать при отправки формы
	$consumers_form.callBackSubmit = function () {
		const key_val = $consumers_form.find('.consumers-form__key').val();
		const name_val = $consumers_form.find('.consumers-form__name').val();
		const tape_val = $consumers_form.find('.consumers-form__type').val();

		callServer.editConsumer(url_edit_consumer, {
			id: id,
			name: name_val,
			type: tape_val,
			key: key_val
		}).done(function (data_from_sever, textStatus, jqXHR) {
			if (data_from_sever.status === 'success') {
				const id = data_from_sever['consumer'].id;
				const name = data_from_sever['consumer'].name;
				const key = data_from_sever['consumer'].key;
				const type = data_from_sever['consumer'].type;
				const type_text = type === 1 ? "Ф" : "Ю";
				const type_toggle = type === 1 ? "Физическое лицо" : "Юридическое лицо";

				// находим потребителя в таблице и изменяем его
				const $consumer_item = $('.consumers-list__item[data-id="' + id + '"]');
				$consumer_item.find('.consumers-list__name').text(name);
				$consumer_item.find('.consumers-list__key').text(key);
				$consumer_item
					.find('.consumers-list__type')
					.attr('title', type_toggle)
					.data('type', type)
					.find('.consumers-list__help-toggle')
					.text(type_toggle);
				$consumer_item.find('.consumers-list__type-text').text(type_text);

				// Обращается к форме и изменяем ее
				$consumers_form.find('.consumers-form__title').text('Пользователь отредактирован');
				let html_edit = `<dl class="dl-horizontal">
									<dt>ФИО</dt>
									<dd>${name}</dd>
									
									<dt>Тип</dt>
									<dd>${type_toggle}</dd>
									
									<dt>Номер потребителя</dt>
									<dd>${key}</dd>
								</dl>`
				$consumers_form.find('.consumers-form__body').html(html_edit);
			}
		});
	}
}


/**
 * Функция для удаления потребителя
 * @param $consumers_item {jQuery} - объект строки потребителя из списка
 */
function deleteConsumerItem($consumers_item) {
	const id = $consumers_item.data('id');
	const name = $consumers_item.find('.consumers-list__name').text();
	const key = $consumers_item.find('.consumers-list__key').text();

	const result = confirm(`Вы собираетесь удалить потребителя "${name}" под номерам - ${key}. 
	Вы уверены что хотите это сделать? 
	Данное действие будет не обратимо.`);

	if (result) {
		callServer.deleteConsumer(url_delete_consumer, id)
			.done(function (data_from_server) {
				if (data_from_server.status === 'success') {
					$consumers_item.remove();
					alert(`Пользователь "${name}" удален`);
				}
			})
	}
}


/**
 * Функция для создания нового потребителя
 * @param $consumers_item
 */
function newConsumerItem($consumers_item) {
	callServer.newConsumer(url_new_consumer)
		.done(function (data_from_server) {
			const id = data_from_server.consumer.id;
			const name = data_from_server.consumer.name;
			const type = data_from_server.consumer.type;
			const key = data_from_server.consumer.key;
			const title = 'Новый потребитель';
			const $consumers_form = buildPopup({id, name, type, key, title});
		});
}


/**
 * Функция для построения popup окна
 * @param id {number} - id потребителя
 * @param name {string} - ФИО потребителя
 * @param type {number} - тип потребителя, 1 - физическое лицо, 2 - юридическое лицо
 * @param key {number} - номер потребителя
 * @param title {string} - заголовок  popup формы
 * @return {jQuery} - объект popup формы
 */
function buildPopup({id, name = '', type = 1, key = '', title = ''} = {}) {
	// создание объекта формы
	const $consumers_form = $(`<form action="" method="get" class="consumers-form">
			<div class="consumers-form__head">
				<h3 class="consumers-form__title">${title}</h3>
				<button title="Close (Esc)" type="button" class="mfp-close">×</button>
			</div>
		
			<div class="consumers-form__body">
				<div class="form-group">
					<label for="consumers-form-name">ФИО</label>
					<input type="text" 
						class="form-control consumers-form__name" 
						id="consumers-form-name" 
						placeholder="ФИО" 
						value="${name}">
					<span class="help-block help-block_error-only">Пожалуйста, введите действительное ФИО</span>
				</div>
				
				<div class="form-group">
					<label for="consumers-form-type">Тип</label>
					<select class="form-control consumers-form__type" id="consumers-form-type">
						<option value="1" ${type === 1 ? 'selected' : ''}>Физическое лицо</option>
						<option value="2" ${type === 2 ? 'selected' : ''}>Юридическое лицо</option>
					</select>
				</div>
				
				<div class="form-group">
					<label for="consumers-form-key">Номер потребителя</label>
					<input type="text" 
						class="form-control consumers-form__key" 
						id="consumers-form-key" 
						placeholder="Номер потребителя" 
						value="${key}">
					<span class="help-block help-block_error-only">Номер потребителя может состоять только из цифр и должен быть длиной 13 символов</span>
				</div>
				
				<div class="form-group">
					<button type="submit" class="btn btn-primary">Сохранить</button>
				</div>
			</div>
		</form>`);

	// функция, которая будет исполнятся после успешного прохождение валидации
	$consumers_form.callBackSubmit = function () {
	};

	const $form_key = $consumers_form.find('.consumers-form__key');
	const $form_name = $consumers_form.find('.consumers-form__name');

	// не позволяем вводить в поле "номер потребителя" ничего кроме цифр,
	// так же сохраняем реакцию на клавиши tab и enter
	$form_key.on('keypress', function (event) {
		// проверяем, какая клавиша нажата
		const code = isNumberCode(event);
		if (code === 'tab' || code === 'enter') {
			// ни чего не делает
		} else if (code === false) {
			event.preventDefault();
		}

		const $input = $(this);

		if ($input.val().length >= 13) {
			event.preventDefault();
		}
	});

	// убираем ошибка при взаимодействии с полями
	$form_key.add($form_name).on('focus', function () {
		$(this).parent().removeClass('has-error');
	});

	// подписываемся на событие отправка формы
	$consumers_form.on('submit', function (event) {
		event.preventDefault();

		let status_validation = true;
		const name_val = $form_name.val();
		const key_val = $form_key.val();

		// производим валидацию
		if (!validationName(name_val)) {
			status_validation = false;
			$form_name.parent().addClass('has-error');
		}
		if (!validationNumber(key_val, 13)) {
			status_validation = false;
			$form_key.parent().addClass('has-error');
		}

		if (status_validation) {
			$consumers_form.callBackSubmit();
		}
	});

	// выстраиваем форму
	$.magnificPopup.open({
		items: {
			src: $consumers_form,
			type: 'inline'
		}
	});

	return $consumers_form;
}


/**
 * Функция сортирует список потребителей
 * @param $sort_btn {jQuery} - нажатая кнопка сортировки
 * @param $consumers_list {jQuery} - список потребителей
 */
function sortConsumersList($sort_btn, $consumers_list) {
	let regulations;
	let direction;

	// определяем тип сортировки
	if($sort_btn.hasClass('up')){
		regulations = ['type', 'name', 'key'];
		direction = 'down';
		$sort_btn.removeClass('up');
		$sort_btn.addClass('down');
	} else if($sort_btn.hasClass('down')){
		regulations = ['name', 'type', 'key'];
		direction = 'up';
		$sort_btn.removeClass('down');
	} else {
		regulations = ['type', 'name', 'key'];
		direction = 'up';
		$sort_btn.addClass('up');
	}

	let object_sort = {};
	// перебираем список потребителей для заполнения объекта сортировки
	$consumers_list
		.find('.consumers-list__item')
		.each(function () {
			const $consumers_item = $(this);

			const id = $consumers_item.data('id');
			const name = $consumers_item.find('.consumers-list__name').text();
			const type = $consumers_item.find('.consumers-list__type').data('type');
			const key = $consumers_item.find('.consumers-list__key').text();

			object_sort[id] = {name, type, key}
		});

	// получает отсортированный массив ключей
	const result_sort = sortObject(object_sort, regulations, direction);

	// находим всех потребителей в порядке сортировки и меняем их расположение
	result_sort.forEach(function (value) {
		const $target_consumer = $consumers_list.find(`.consumers-list__item[data-id="${value}"]`);
		$consumers_list.find('.consumers-list__add').before($target_consumer);
	})
}


/**
 * Функция фильтрует вводимые символы с клавиатуры.
 * Позволяет вводить цифры и клавиши стрелки вправо, влево, backspace, delete, enter, tab.
 * @param event {event} - объект события
 * @return {boolean|'enter'|'tab'} - возвращает true - если цифра или клавиши стрелки вправо, влево, backspace, delete,
 * 'enter' и 'tab' если нажаты соответствующие клавиши, иначе false.
 */
function isNumberCode(event) {
	// получаем код клавиши
	var code = (event.keyCode ? event.keyCode : event.which);

	// далаем кучу проверок
	var is_meta_key = (event.ctrlKey || event.altKey || event.metaKey);
	var is_number = (48 <= code && code <= 57);
	var is_backspace = (code === 8);
	var is_delete = (code === 46);
	var is_arrow_left = (code === 37);
	var is_arrow_right = (code === 39);
	var is_enter = (code === 13);
	var is_tab = (code === 8);

	if (is_tab) {
		return 'tab'
	} else if (is_enter) {
		return 'enter';
	} else {
		// если не цифры или сопутствующее, блокируем
		return !(is_meta_key || !(is_number || is_backspace || is_delete || is_arrow_left || is_arrow_right))
	}
}