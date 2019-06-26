const {sortObject} = require('../src/js/utilities/sort.js');
const assert = require('assert');


describe("Проверка функции sortObject", function() {

	const test_object = {
		i:{
			key: 3,
			name: 'ав',
		},
		u:{
			key: 3,
			name: 'ав',
		},
		y:{
			key: 3,
			name: 'бв',
		},
		t:{
			key: 1,
			name: 'ав',
		},
		r:{
			key: 2,
			name: 'ас',
		},
		e:{
			key: 2,
			name: 'ав',
		},
		w:{
			key: 1,
			name: 'ад',
		},
		q:{
			key: 1,
			name: 'аб',
		}
	};

	const result_test_up = 'qtweriuy';
	const result_test_down = 'yiurewtq';

	it(`Проверка функции sortObject в прямом направлении`, function() {
		assert.equal(sortObject(test_object, ['key', 'name']).join(''), result_test_up);
	});

	it(`Проверка функции sortObject в обратном направлении`, function() {
		assert.equal(sortObject(test_object, ['key', 'name'], 'down').join(''), result_test_down);
	});
});