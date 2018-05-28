import render from './templates/friend.hbs';

import './style/styles.css';

let chosen = [];
let selected = document.querySelector('.friends--selected');
let allFriends = document.querySelector('.friends');

selected.innerHTML = render({ 'items': chosen, 'chosens': true });

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
        
        let items = response.items;

        console.log(items);
        console.log(response);
        allFriends.innerHTML = render({ 'items': items, 'chosens': false });
    })
});

// let dragSrcElem = null;

function moveFriend(friend, source, destination) {
    console.log('move');

}

allFriends.addEventListener('dragstart', function(e) {
    if (!(e.target.classList.contains('friend'))) {
 return; 
}

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    // e.dataTransfer.setData('text/html', this.innerHTML);
    // dragSrcElem = this;

    console.log('move');
})

selected.addEventListener('dragover', function(e) {

    if (e.preventDefault) {
        e.preventDefault();
    }
    
    //   e.dataTransfer.dropEffect = 'move';  
    console.log('over-draggage');
    
    return false;
})

selected.addEventListener('dragenter', function(e) {

    if (e.preventDefault) {
        e.preventDefault();
    }
    
    //   e.dataTransfer.dropEffect = 'move';  
    console.log('drag-enterance');
    
    return false;
})

selected.addEventListener('drop', function(e) {

    // if (e.stopPropagation) {
    //     e.stopPropagation(); 
    // }

    let target = e.target;
        
    let data = e.dataTransfer.getData('text/html');

    console.log(data);

    // if (dragSrcEl != this) {
    //     // Set the source column's HTML to the HTML of the columnwe dropped on.
    //     dragSrcEl.innerHTML = this.innerHTML;
    //     this.innerHTML = e.dataTransfer.getData('text/html');
    // }

    if (target.classList.contains('friends--selected')) {
        
        let newLI = document.createElement('li');

        newLI.classList.add('friend');
        newLI.innerHTML = data;
        target.appendChild(newLI);

    }

    e.preventDefault();

    return false;
})