import render from './templates/friend.hbs';

import './style/styles.css';

let chosens = [];
let all = [];
let selected = document.querySelector('.friends--selected');
let allFriends = document.querySelector('.friends');
let parentElem = document.querySelector('.app__workspace');

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

    parentElem.addEventListener('dragstart', function(e) {
        if (!(e.target.classList.contains('friend')) &&
        (e.target.closest('ul').classList.contains('friends--selected')) ) {
            return; 
        }
    
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.dataset.id);

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
        if (!(e.target.closest('ul').classList.contains('friends--selected'))) {
            return;
        }

        let idOfTheSelected = e.dataTransfer.getData('text/html');

        // get the transferred item
        // const position = all.findIndex((elem) => {
        //     return elem.id == idOfTheSelected
        // });
    
        // let chosenFriend = all.splice(position, 1);

        let chosenFriend = findAndRemove(idOfTheSelected, all);

        chosens.push(...chosenFriend);
        console.log(chosenFriend);
        clearList(allFriends);
        allFriends.innerHTML = render({ 'items': all, 'chosens': false });

        clearList(selected);
        selected.innerHTML = render({ 'items': chosens, 'chosens': true });

        e.preventDefault();

        return false;

    });

    allFriends.addEventListener('click', (e) => {
        
        if(!(e.target.classList.contains('button__line'))) return;

        let friend = e.target.closest('li');

        let friendId = friend.dataset.id;

        let chosenFriend = findAndRemove(friendId, all);

        chosens.push(...chosenFriend);
        clearList(allFriends);
        allFriends.innerHTML = render({ 'items': all, 'chosens': false });

        clearList(selected);
        selected.innerHTML = render({ 'items': chosens, 'chosens': true });

        console.log(friend);
        console.log(friendId);
    });

    selected.addEventListener('click', (e) => {
        if(!(e.target.classList.contains('button__line'))) return;

        let friend = e.target.closest('li');

        let friendId = friend.dataset.id;

        let chosenFriend = findAndRemove(friendId, chosens);

        all.push(...chosenFriend);

        clearList(allFriends);
        allFriends.innerHTML = render({ 'items': all, 'chosens': false });

        clearList(selected);
        selected.innerHTML = render({ 'items': chosens, 'chosens': true });

    });

});