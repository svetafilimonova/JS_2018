/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {

    let block = document.createElement('div');

    block.classList.add('draggable-div');
    block.style.backgroundColor = getRandomColor();
    block.style.width = getValues();
    block.style.height = getValues();
    block.style.position = 'absolute';
    block.style.top = getValues();
    block.style.left = getValues();

    return block;

    function getValues() {
        return Math.floor(Math.random() * 100) + 100 + 'px';
    }
  
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';

        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        
        return color;

    }

}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {
    const homeworkContainer = document.querySelector('#homework-container');

    target.addEventListener('mousedown', function(e) {
        var coords = getCoords(target);
        var posX = e.pageX - coords.left;
        var posY = e.pageY - coords.top;

        homeworkContainer.appendChild(target);
        moveObject(e);

        target.addEventListener('mouseup', mouseUpHandler);

        function moveObject(e) {
            target.style.left = e.pageX - posX + 'px';
            target.style.top = e.pageY- posY + 'px';
        }
    
        document.onmousemove = function(e) {
            moveObject(e);
        }

        function mouseUpHandler () {
            document.onmousemove = null;
            target.onmouseup = null;
        }

        target.ondragstart = function() {
            return false;
        };
    
        function getCoords(elem) {
            var box = elem.getBoundingClientRect();

            return {
                top: box.top + pageYOffset,
                left: box.left + pageXOffset
            };
        }

    });
  
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
