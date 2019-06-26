const {validationName, validationNumber} = require('../src/js/utilities/validation.js');
const assert = require('assert');


describe("Проверка функции validationName", function() {

	const name_true = [
		'Петров Петр Петрович',
		'Петров-Черный Петр Петрович',
		'Ли Лу Янг',
		'Dwain Simmons Simmons',
	];

	const name_false = [
		'Петров Петр',
		'Салим-оглы Мамед',
		'И Иван Иванович',
		'Dwain Simmons',
		'Dwain-Branden Simmons',
	];

	name_true.forEach(function (value, index, array) {
		it(`${value} - true`, function() {
			assert.equal(validationName(value), true);
		});
	});

	name_false.forEach(function (value, index, array) {
		it(`${value} - false`, function() {
			assert.equal(validationName(value), false);
		});
	});
});

describe("Проверка функции validationNumber", function() {

	const number_true = [
		'1000000000001',
		1000000000002,
	];

	const number_false = [
		'100000000001',
		'10000000000002',
		100000000003,
		10000000000004,
		'10000a0000005',
	];

	number_true.forEach(function (value, index, array) {
		it(`${value} - true`, function() {
			assert.equal(validationNumber(value, 13), true);
		});
	});

	number_false.forEach(function (value, index, array) {
		it(`${value} - false`, function() {
			assert.equal(validationNumber(value, 13), false);
		});
	});
});