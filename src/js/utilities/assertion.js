/**
 * Проверка на то, является ли переданный объект jQuery объектом
 * @param obj
 * @return {boolean}
 */
function isjQuery(obj) {
	return (obj && (obj.constructor.prototype.jquery)) || false;
}

module.exports = {isjQuery};