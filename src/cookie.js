/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

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
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

const cookies = document.cookie.split('; ').reduce((prev, curr) => {
    
    const [name, value] = curr.split('=');

    if (name != '') {
        prev[name] = value;

        return prev;
    }
    
}, {});

filterNameInput.addEventListener('keyup', function() {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    let filter = filterNameInput.value;
    let cookieArray = document.cookie.split('; ');
    let filteredCookies = matching(filter, cookieArray);

    clearTable(listTable);
    renderCookie(filteredCookies);

});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"

    if (addNameInput.value !== '' && addNameInput.value !== '') {
        let filter = filterNameInput.value;

        if (filter !=='' && (addNameInput.value.indexOf(filter) === -1) && (addValueInput.value.indexOf(filter)=== -1)) {
            document.cookie = `${addNameInput.value}=${addValueInput.value}` || {}

            if (filter !=='' && cookies.hasOwnProperty(addNameInput.value)) {
                let cookieArray = document.cookie.split('; ');
                let filteredCookies = matching(filter, cookieArray);
  
                clearTable(listTable);
                renderCookie(filteredCookies);
  
            }

            return;
        }

        document.cookie = `${addNameInput.value}=${addValueInput.value}` || {}
        cookies[addNameInput.value] =addValueInput.value;
  
        let newRow = document.createElement('tr');
        let nameCell = document.createElement('td');
        let valCell = document.createElement('td');
        let btnCell = document.createElement('td');
        let deleteBtn = document.createElement('button');
  
        nameCell.innerText = addNameInput.value;
        valCell.innerText = addValueInput.value;
        deleteBtn.innerHTML = 'Удалить';
        btnCell.appendChild(deleteBtn);
        newRow.appendChild(nameCell);
        newRow.appendChild(valCell);
        newRow.appendChild(btnCell);
        listTable.appendChild(newRow);
  
        clearTable(listTable);
        renderCookie(cookies);
  
        // addNameInput.value ='';
        // addValueInput.value = '';
        
    }

});

function renderCookie(cookieObj) {

    if (cookieObj) {
        for (let key in cookieObj) {
            if (cookieObj.hasOwnProperty(key)) {
                let newRow = document.createElement('tr');
                let nameCell = document.createElement('td');
                let valCell = document.createElement('td');
                let btnCell = document.createElement('td');
                let deleteBtn = document.createElement('button');

                nameCell.innerText = key;
                valCell.innerText = cookieObj[key];
                deleteBtn.innerHTML = 'Удалить';
                deleteBtn.classList.add('delete-btn');
                btnCell.appendChild(deleteBtn);
                newRow.appendChild(nameCell);
                newRow.appendChild(valCell);
                newRow.appendChild(btnCell);
                listTable.appendChild(newRow);
            }
        }
    }
}

function clearTable(parentElem) {
    while (parentElem.children.length) {

        for (let child of parentElem.children) {
            parentElem.removeChild(child);
        }

    }
   
}

document.addEventListener('DOMContentLoaded', renderCookie(cookies));

listTable.addEventListener('click', function(e) {
    if (!(e.target.classList.contains('delete-btn'))) { 
        return; 
    }

    let btn = e.target;
    let row = btn.closest('tr');
    let key = row.children[0].innerText;
    let date = new Date(0);

    document.cookie = `${key}=; path=/; expires=${date.toUTCString()}`;
    delete cookies[key];
    clearTable(listTable);
    renderCookie(cookies);

});

function matching(filter, where) {

    let filteredArr = where.filter(elem => {
        if (elem.indexOf(filter) !== -1) {
            return elem;
        }

    });

    let filteredObj = filteredArr.reduce((prev, curr) => {
        const [name, val] = curr.split('=');

        if (name != '') {
            prev[name] = val;
      
            return prev;
        }
    }, {});

    return filteredObj;

}

