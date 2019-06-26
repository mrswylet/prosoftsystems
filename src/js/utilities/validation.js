/**
 * Проверка на то, является ли строка ФИО
 * @param value
 * @return {boolean}
 */
function validationName(value) {
	const regExp = /^[А-ЯA-Z][а-яa-zА-ЯA-Z\-]+\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]+\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]+$/;
	return regExp.test(value)
}


/**
 * Проверка на то, является ли строка числом
 * @param value {string|number} - проверяемое значение
 * @param length {number} - максимально возможная длина строки
 * @return {boolean}
 */
function validationNumber(value, length = 13){
	let str_value = value+'';
	const regExp = /^\d+$/;
	return regExp.test(str_value) && str_value.length === length;
}

module.exports = {validationName, validationNumber};