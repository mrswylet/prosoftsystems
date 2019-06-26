/**
 * Функция объект объектов сравнивая их ключи, согласно приоритету ключей
 * @param object {object} - объект объектов для сортировки
 * @param regulations {array} - массив приоритета сортировки по ключам
 * @param direction {string} - направление сортировка, если up (по умолчанию) - прямая сортировка, если down - обратная
 * @return {array}
 */
function sortObject(object, regulations, direction = 'up') {
	try {
		let arr_sort = Object.keys(object);
		arr_sort.sort((a, b) => {
			const obj_a = object[a];
			const obj_b = object[b];

			if(direction === 'up'){
				return sortObjectRegulator(obj_a, obj_b, regulations, 0)
			} else {
				return (-1 * sortObjectRegulator(obj_a, obj_b, regulations, 0))
			}
		});
		return arr_sort;
	} catch (error) {
		console.error(error)
	}
}


/**
 * Функция сравнивает два объекта
 * @param obj_a {object} - первый объект для сравнения
 * @param obj_b {object} - второй объект для сравнения
 * @param regulations {object} - массив приоритета сортировки по ключам
 * @param index_regulations {number} - индекс ключа массива приоритета, по которому происходит сравнение в текущей итерации
 * @return {number} - 1 если obj_a > obj_b, 0 - если они равны, иначе -1
 */
function sortObjectRegulator(obj_a, obj_b, regulations, index_regulations) {
	const kay = regulations[index_regulations];

	let val_a = obj_a[kay];
	let val_b = obj_b[kay];

	// если сравнивать придется по строкам, то нужно учесть общеизвестную проблему
	// где "ё" > "я" и "а" > "Я", а также убрать все пробельные элементы
	if (typeof val_a === "string") {
		val_a = val_a.replace(/[ё\s]/g, function (match) {
			return match === 'ё' ? 'е' : '';
		});
		val_a = val_a.toLowerCase();
	}
	if (typeof val_b === "string") {
		val_b = val_b.replace(/[ё\s]/g, function (match) {
			return match === 'ё' ? 'е' : '';
		});
		val_b = val_b.toLowerCase();
	}

	if (val_a > val_b) {
		return 1;
	} else if (val_a < val_b) {
		return -1;
	} else {
		// проверяем, присутствует ли следующий регулятор сортировки
		const next_index_regulation = ++index_regulations;
		if (regulations[next_index_regulation]) {
			return sortObjectRegulator(obj_a, obj_b, regulations, next_index_regulation);
		} else {
			return 0;
		}
	}
}

module.exports = {sortObject};