import render from './templates/friend.hbs';

import './style/styles.css';

let chosens = JSON.parse(localStorage.getItem('chosens')) ? JSON.parse(localStorage.getItem('chosens')) : [];
let all = JSON.parse(localStorage.getItem('allFriends')) ? JSON.parse(localStorage.getItem('allFriends')) : [];
let selected = document.querySelector('.friends--selected');
let allFriends = document.querySelector('.friends');
let parentElem = document.querySelector('.app__workspace');
let searchAll = document.querySelector('.search__input--all');
let searchSelected = document.querySelector('.search__input--selected');
let saveBtn = document.querySelector('.saver');

console.log(JSON.parse(localStorage.getItem('allFriends')));
console.log(localStorage.getItem('chosens'));
selected.innerHTML = render({ 'items': chosens, 'chosens': true });

function clearList(list) {
    while (list.hasChildNodes()) {
        list.removeChild(list.lastChild);
    }
}

function findAndRemove(friendId, allfriendArr) {
    const position = allfriendArr.findIndex((elem) => {
        return elem.id == friendId
    });

    let chosenFriend = allfriendArr.splice(position, 1); 

    return chosenFriend;
}

document.addEventListener('DOMContentLoaded', function() {
    if (all.length || chosens.length) {
        allFriends.innerHTML = render({ 'items': all, 'chosens': false }); 
        selected.innerHTML = render({ 'items': chosens, 'chosens': true }); 

    } else { 
        VK.init({
            apiId: 6492031
        }, '5.78');
        function auth() {
            return new Promise((resolve, reject) => {
           
                VK.Auth.login(data =>{
                    if (data.session) {
                        resolve()
                    } else {
                        reject(new Error('Проблемы с авторизацией!'));
                    }
                }, 2);
            });
        }

        function callAPI(method, params) {
            params.v = '5.78';
        
            return new Promise((resolve, reject) =>{
                VK.api(method, params, (data) =>{
                    if (!data.error) {
                        resolve(data.response)
                    } else {
                        reject(data.error);
                    }
                });
            });
        }
        auth().then(() => { 
        // console.log('Authorization  is completed') 
            return callAPI('friends.get', { count: 100, fields: 'photo_50' })
        }).then((response)=> { 
        
            all = response.items;
        
            allFriends.innerHTML = render({ 'items': all, 'chosens': false });
        })

    }

    // *******************DND handlers*********************

    parentElem.addEventListener('dragstart', function(e) {
        if (!(e.target.classList.contains('friend'))) {
            return; 
        }

        let friend = e.target;

        e.dataTransfer.effectAllowed = 'move';
        
        let friendsInfo = {
            id: e.target.dataset.id,
            origin: e.target.parentNode.classList.value
        }
        let stringifiedInfo = JSON.stringify(friendsInfo) ;

        e.dataTransfer.setData('stringifiedInfo', stringifiedInfo);

        console.log(JSON.stringify(friend));
        console.log(JSON.stringify(stringifiedInfo));

    })

    parentElem.addEventListener('dragover', function(e) {

        if (e.preventDefault) {
            e.preventDefault();
        }
    
        return false;
    })

    parentElem.addEventListener('dragenter', function(e) {

        if (e.preventDefault) {
            e.preventDefault();
        }

        return false;
    })

    parentElem.addEventListener('drop', function(e) {
        // if (!(e.target.classList.contains('friends'))) {
        //     return;
        // }

        let friend = e.dataTransfer.getData('stringifiedInfo');
        let friendData = JSON.parse(friend);
        let idOfTheSelected = friendData.id;

        console.log(friendData);
        console.log(e.target.classList.contains('friends'));
        console.log(friendData.origin.includes('friends--all'));

        if (friendData.origin.includes('friends--all')) {
            let chosenFriend = findAndRemove(idOfTheSelected, all);

            chosens.push(...chosenFriend);

        } else if (friendData.origin.includes('friends--selected')) {
            let chosenFriend = findAndRemove(idOfTheSelected, chosens);

            all.push(...chosenFriend);
        }

        clearList(allFriends);
        
        // allFriends.innerHTML = render({ 'items': all, 'chosens': false });
        allFriends.innerHTML = render( { 'items': filterFriend(searchAll.value, all), 'chosens': false });

        clearList(selected);
        selected.innerHTML = render({ 'items': filterFriend(searchSelected.value, chosens), 'chosens': true });
     
        e.preventDefault();

        return false;

    });

    parentElem.addEventListener('click', (e) => {
        
        if (!(e.target.classList.contains('button--add'))) { 
            return;
        }

        let friend = e.target.closest('li');

        let friendId = friend.dataset.id;

        let chosenFriend = findAndRemove(friendId, all);

        chosens.push(...chosenFriend);
        clearList(allFriends);
        allFriends.innerHTML = render({ 'items': all, 'chosens': false });

        clearList(selected);
        // selected.innerHTML = render({ 'items': chosens, 'chosens': true });
        selected.innerHTML = render({ 'items': filterFriend(searchSelected.value, chosens), 'chosens': true });
        console.log(friend);
        console.log(friendId);
    });

    parentElem.addEventListener('click', (e) => {
        if (!(e.target.classList.contains('button--close'))) { 
            return; 
        }

        let friend = e.target.closest('li');

        let friendId = friend.dataset.id;

        let chosenFriend = findAndRemove(friendId, chosens);

        all.push(...chosenFriend);

        clearList(allFriends);

        allFriends.innerHTML = render({ 'items': filterFriend(searchAll.value, all), 'chosens': false });
        clearList(selected);
        selected.innerHTML = render({ 'items': chosens, 'chosens': true });

    });

    function filterFriend(filter, friendArr) {
        filter = filter.toLowerCase();
        let filteredFriend = friendArr.filter((el)=> {
            if (el.first_name.toLowerCase().includes(filter) || el.last_name.toLowerCase().includes(filter)) {
                return el;
            }

        });

        return filteredFriend;
    }

    searchAll.addEventListener('keyup', (e) => {

        let filter = e.target.value;

        console.log(filter);
        let filtered = filterFriend(filter, all);

        clearList(allFriends);
        allFriends.innerHTML = render({ 'items': filtered, 'chosens': false });

        console.log(filtered);

    });

    searchSelected.addEventListener('keyup', (e) => {

        let filter = e.target.value;

        console.log(filter);
        let filtered = filterFriend(filter, chosens);

        clearList(selected);
        selected.innerHTML = render({ 'items': filtered, 'chosens': true });

        console.log(filtered);

    });

    saveBtn.addEventListener('click', () => {

        localStorage.setItem('allFriends', JSON.stringify(all));
        localStorage.setItem('chosens', JSON.stringify(chosens));
        alert('Список друзей успешно экспортирован');
    });

});