import render from './templates/friend.hbs';

import './style/styles.css';

// let items = [
//     { name: 'Harry',
//         last_name: 'Kasparov',
//         img: 'https://pp.userapi.com/c639225/v639225708/4888/XPJ3OPWsw1Q.jpg'
//     },
//     { name: 'Harry',
//         last_name: 'Wallas',
//         img: 'https://pp.userapi.com/c840136/v840136848/3d874/sCKtLZwA59A.jpg' }
// ];

let chosen = [
    { first_name: 'Sandy',
        last_name: 'Claws',
        photo_50: 'https://pp.userapi.com/c639224/v639224147/f582/8fnPWTvAVUw.jpg'
    }
];

let selected = document.querySelector('.friends--selected');
let block = document.querySelector('.friends');

selected.innerHTML = render({ chosen });

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
        block.innerHTML = render({ items });
    })
});