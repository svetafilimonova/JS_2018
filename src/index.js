/* ДЗ 2 - работа с массивами и объеектами */

/*
 Задание 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (var i = 0 ; i < array.length; i++ ) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:
 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    var newArr = [];

    for (var i = 0; i < array.length; i++) {
        newArr.push(fn(array[i], i, array));
    }
    
    return newArr;
}

/*
 Задание 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    var accum = array[0];
    var initialIndex = 1;

    if (initial) {
        accum = initial;
        initialIndex = 0;

    }

    for ( var i = initialIndex; i < array.length; i++) {
        accum = fn(accum, array[i], i, array);
    }

    return accum;
}

/*
 Задание 4:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива
 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    var names = Object.keys(obj);

    return names.map( name => name.toUpperCase())
}

/*
 Задание 5 *:
 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */

 /*

 begin
Индекс (счёт начинается с нуля), по которому начинать извлечение.
Если индекс отрицательный, begin указывает смещение от конца последовательности. Вызов slice(-2) извлечёт два последних элемента последовательности.
Если begin опущен, slice() начинает работать с индекса 0.
end
Индекс (счёт начинается с нуля), по которому заканчивать извлечение. Метод slice() извлекает элементы с индексом меньше end.
Вызов slice(1, 4) извлечёт элементы со второго по четвёртый (элементы по индексам 1, 2 и 3).
Если индекс отрицательный, end указывает смещение от конца последовательности. Вызов slice(2, -1) извлечёт из последовательности элементы начиная с третьего элемента с начала и заканчивая вторым с конца.
Если end опущен, slice() извлекает все элементы до конца последовательности (arr.length).

 */

function slice(array, from = 0, to = array.length) {
    var newArr = [];
    var arrayLength = array.length;

    if (from < 0) {
        let tempFrom = arrayLength + from;

        from = tempFrom > 0 ? tempFrom : 0;
    } 

    if (to < 0) {
        to = arrayLength + to;
    }

    for (let i = from; i < arrayLength && i < to; i++) {
        newArr.push(array[i]);
    }

    return newArr;
}

// var arr = [1,2,3,4,5,6];

// console.log(`У нас ${slice(arr,-1,1)}, надо ${arr.slice(-1,1)}`);

// var sliced = arr.slice(1,0);
// console.log(sliced);

/*
 Задание 6 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
   //1.create Proxy
//    let proxy = new Proxy(obj, handler);
   //2. code setter trap
//    if (handler )
   //3. check if input value  isFinite
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};