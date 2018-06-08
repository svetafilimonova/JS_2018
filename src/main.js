import './style/styles.css';

import render from './templates/review.hbs';

// const map = document.querySelector('.map');

document.addEventListener('DOMContentLoaded', function () {

    let temporaryPlacemark;
    let coords;
    let allPlacemarks = [];
    // let currentMark;
    let form = document.querySelector('.form');
    const nameInput = document.querySelector('.comment-form__name');
    const placeInput = document.querySelector('.comment-form__place');
    const messageInput = document.querySelector('.comment-form__comment');
    const reviews = document.querySelector('.form__reviews');
    let map = document.querySelector('.map');
    let reviewBuffer;
    
    new Promise(resolve => ymaps.ready(resolve))
        .then(() => init());

    // ymaps.ready(init);
    let myMap;
    let clusterer;


    function clearComments(form) {

        while (form.hasChildNodes()) {
            form.removeChild(form.lastChild);
        }

        reviews.innerText = "Здесь отзывов пока нет...";
    }

    function formatDate(d){
        let result;
        if(d){

            let month = addExtraZero(d.getMonth());
            let day = addExtraZero(d.getDate());
            let hours = addExtraZero(d.getHours());
            let minutes =  addExtraZero(d.getMinutes());
            let seconds =  addExtraZero(d.getSeconds())

            result = `${d.getFullYear()}.${month}.${day} ${hours}:${minutes}:${seconds}`
        } 
        return result;

    }

    function addExtraZero(val){
        return (val < 10? "0" : "") + val;
    }

    function formPositioning(elem, posLeft, posTop) {
        let windowWidth = document.documentElement.clientWidth;
        let windowHeight = document.documentElement.clientHeight;
        // let elemCoords = elem.getBoundingClientRect();
        let elemWidth = elem.getBoundingClientRect().width;
        let elemHeight = elem.getBoundingClientRect().height;
        let elemPosLeft = posLeft + elemWidth;
        let elemPosTop = posTop + elemHeight;
        let xDifference = windowWidth - elemPosLeft;
        let yDifference = windowHeight - elemPosTop;

        if(xDifference < 0) {

            // elem.style.left = `${posLeft + xDifference -50}px`;
            if(posLeft > windowWidth/2) {
                elem.style.left = `${posLeft + xDifference - 50}px`;
                console.log('left more than half wind width');
            } else {
                elem.style.left = `${posLeft + xDifference}px`;
            }

        } else {
            elem.style.left = `${posLeft}px`;
        }

        if(yDifference < 0 ) {
            elem.style.top = `${posTop + yDifference -50}px`;
        } else {
            elem.style.top = `${posTop}px`;
        }
   

        console.log('windowWidth'+ windowWidth);
        console.log('windowHeight' + windowHeight);
        console.dir('xDifference' + xDifference);
        console.dir('yDifference' + yDifference);
        console.dir(elemWidth);
        // elem.style.top = `${posTop}px`;
        // elem.style.left = `${posLeft}px`;
    }

//////////////////////////////////////form event handlers/////////////////////////

map.addEventListener('click', (e) => {

    let posTop = e.pageY;
    let posLeft = e.pageX;
    formPositioning(form, posLeft, posTop);
    console.log('posTop' + posTop);
    console.log('posLeft' + posLeft);


})

const submitter = document.querySelector('.form__btn-submit');

submitter.addEventListener('click', (e) => {
    e.preventDefault();
    //let review = [];

    temporaryPlacemark = new ymaps.GeoObject({
        geometry: {
            type: 'Point',
            coordinates: coords
        }
    });
   

    if (temporaryPlacemark && 
        (nameInput.value !=='') && 
        (placeInput.value !=='') && 
        (messageInput.value !=='')) {
        let d =new Date();
        let dateOfComment =  formatDate(d) ;
        console.log(dateOfComment);


        const newLocal = temporaryPlacemark.properties.set('review', {
        name: nameInput.value,
            place: placeInput.value,
            date: dateOfComment,
            message: messageInput.value
        });

        // let reviewsOfPlacemark = [];
        // reviewsOfPlacemark.push({name: nameInput.value,
        //                         place: placeInput.value,
        //                         date: dateOfComment,
        //                         message: messageInput.value});

        // temporaryPlacemark.properties.set('reviews', reviewsOfPlacemark);
        temporaryPlacemark.properties.set('coordinates', coords);
        temporaryPlacemark.properties.set('id', Date.now());

        allPlacemarks.push(temporaryPlacemark);

        let reviewsData = [];
        reviewBuffer.push({'name': nameInput.value,
                            'date':dateOfComment,
                              'place': placeInput.value,
                              'message': messageInput.value});

        console.log(reviewBuffer[0]);
        
        reviews.innerHTML = render({'reviews': reviewBuffer});
        console.log(Date.now());
        console.log(allPlacemarks);

        myMap.geoObjects.add(temporaryPlacemark);
        clusterer.add(temporaryPlacemark);
        // temporaryPlacemark = null;
        nameInput.value = '';   
        placeInput.value = '';
        messageInput.value = '';
        
    }

    
});

const closeBtn = document.querySelector('.btn-close');
closeBtn.addEventListener('click', (e) => {

        form.classList.remove('active');
        nameInput.value = '';
        placeInput.value = '';
        messageInput.value = '';

});


///////////////////////////////////////////////////////////////////////////////

    // function createNewPlaceMark(dataFromForm){
       
    //     let myGeo = new ymaps.GeoObject({
    //         geometry: {
    //             type: 'Point',
    //             coordinates: dataFromForm.e.get('coords')
    //         }

    //     });
    //     console.log(myGeo);
    //     //here we can set data from form to our Placemark
        
    //     myGeo.properties.set('test', [1, 2, 3]);
    //     let test = myGeo.properties.get('test');
    //     console.log(test);
    //     myMap.geoObjects.add(myGeo);
    //     return myGeo;
    // }


    function init() {

        myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 9
        }, {
            balloonMaxWidth: 200,
            searchControlProvider: 'yandex#search'
        });

         clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });

        myMap.geoObjects.add(clusterer);

/*************************MAP Click Handler*************************************/

    myMap.events.add('click', async function (e) {
        let address = document.querySelector('.header__address');
        coords = e.get('coords');
        clearComments(reviews);    
        form.classList.add('active');

        

        try {
            const data = await ymaps.geocode(coords);
            const str = data.geoObjects.get(0).getAddressLine();
            address.innerText = str;
            reviewBuffer = [];

        } catch (e) {
            console.log(e);
        }

        console.log(e.get('target'));
        console.log("click");

    });

    myMap.geoObjects.events.add('click', function (e) {
     
        // Получение ссылки на дочерний объект, на котором произошло событие.
        var object = e.get('target');
        if(e.get('target').geometry.getType()) {
            console.log('placemark click')

        }
    });

    }
})