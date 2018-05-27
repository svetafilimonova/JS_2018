import render from './templates/friend.hbs';

import './style/styles.css';

console.log('hello');

let items = [
    { name: 'Harry',
        last_name: 'Kasparov',
        img: 'https://pp.userapi.com/c639225/v639225708/4888/XPJ3OPWsw1Q.jpg'
    },
    { name: 'Harry',
        last_name: 'Wallas',
        img: 'https://pp.userapi.com/c840136/v840136848/3d874/sCKtLZwA59A.jpg' }
];

let chosen = [
    { name: 'Sandy',
        last_name: 'Claws',
        img: 'https://pp.userapi.com/c639224/v639224147/f582/8fnPWTvAVUw.jpg'
    }
];

let block = document.querySelector('.friends');

let selected = document.querySelector('.friends--selected');

block.innerHTML = render({ items });

selected.innerHTML = render({chosen});