/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');
let towns = [];
const url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */

function loadTowns() {
    return new Promise(function(resolve, reject) {

        const xhr = new XMLHttpRequest();

        xhr.responseType = 'json';
        xhr.open('Get', url, true);

        xhr.onload = function() {
            if (this.status === 200) {
                let response = [...this.response];

                response.sort( (a, b) => {
                    let aName = a.name;
                    let bName = b.name;
    
                    if (aName < bName) {
                        return -1;
                    } else if (aName > bName) {
                        return 1;
                    } 
    
                    return 0;
          
                });
                resolve(response);
              
            } else {
                reject(new Error('Не удалось загрузить города')); 
            }
        }

        xhr.send();
        xhr.onerror = function () {
            reject(new Error('Не удалось загрузить города')); 
        }

    }) 
}

let myTowns = loadTowns();

myTowns.then(
    response => {
        loadingBlock.style.display = 'none';
        filterBlock.style.display = 'block';
        towns = response;
    },
    error => {

        loadingBlock.innerText = error.message;
        let reload = document.createElement('button');

        if (!(homeworkContainer.querySelector('.reload-btn'))) {

            reload.classList.add('reload-btn');
            reload.innerText = 'Повторить';
            homeworkContainer.appendChild(reload);
        }

        homeworkContainer.addEventListener('click', function (e) {
            if (!(e.target.classList.contains('reload-btn'))) { 
                return; 
            }

            loadTowns();
            homeworkContainer.removeChild(reload);

        });

    }
);
/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    let index = full.indexOf(chunk);

    return !(index === -1);
}

/* Блок с надписью "Загрузка" */

filterInput.addEventListener('keyup', function() {
    // это обработчик нажатия кливиш в текстовом поле
    let inputValue = filterInput.value;
    let matchingTowns = [];

    let results = filterResult.children;

    clearElem(results);
    
    if (inputValue !== '') {

        matchingTowns = towns.filter(elem => {
            return isMatching(elem.name, inputValue);
        });

        for (let town of matchingTowns) {
            let townName = town.name;
            let div = document.createElement('div');

            div.innerText = townName;
            filterResult.appendChild(div);   
        }

    } else {
        clearElem(results);
        
        return matchingTowns;

    }

    function clearElem(elem) {

        for (let child of elem) {
            filterResult.removeChild(child);

        }

    }

});

export {
    loadTowns,
    isMatching
};
