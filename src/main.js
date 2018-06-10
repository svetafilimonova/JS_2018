import './style/styles.css';

import render from './templates/review.hbs';


document.addEventListener('DOMContentLoaded', function () {

    let temporaryPlacemark;
    let coords;
    let allPlacemarks = [];
    let form = document.querySelector('.form');
    const nameInput = document.querySelector('.comment-form__name');
    const placeInput = document.querySelector('.comment-form__place');
    const messageInput = document.querySelector('.comment-form__comment');
    const reviews = document.querySelector('.form__reviews');
    let map = document.querySelector('.map');
    let reviewBuffer;
    let addressFromCoords;
    
    new Promise(resolve => ymaps.ready(resolve))
        .then(() => init());

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
        let elemWidth = elem.getBoundingClientRect().width;
        let elemHeight = elem.getBoundingClientRect().height;
        let elemPosLeft = posLeft + elemWidth;
        let elemPosTop = posTop + elemHeight;
        let xDifference = windowWidth - elemPosLeft;
        let yDifference = windowHeight - elemPosTop;

        if(xDifference < 0) {

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
   
    }

    function setBalloonContent(placemarks) {

        for(let i=0; i < placemarks.length;i++) {

        }

    };

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

    temporaryPlacemark = new ymaps.GeoObject({
        geometry: {
            type: 'Point',
            coordinates: coords
        },
    
    });
    temporaryPlacemark.options.set('hasBalloon', false);

    if (temporaryPlacemark && 
        (nameInput.value !=='') && 
        (placeInput.value !=='') && 
        (messageInput.value !=='')) {
        let d =new Date();
        let dateOfComment =  formatDate(d) ;

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
        temporaryPlacemark.properties.set('balloonContentHeader', placeInput.value);
        temporaryPlacemark.properties.set('balloonContentBody', messageInput.value);
        temporaryPlacemark.properties.set('balloonContentLink', addressFromCoords);
        temporaryPlacemark.properties.set('balloonContentFooter', dateOfComment);


        allPlacemarks.push(temporaryPlacemark);

        let reviewsData = [];
        reviewBuffer.push({'name': nameInput.value,
                            'date':dateOfComment,
                            'place': placeInput.value,
                            'message': messageInput.value});

        
        reviews.innerHTML = render({'reviews': reviewBuffer});


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


// *************************************ADDRESS LINK CLICK HANDLER ***********************************************

document.addEventListener('click', (e) => {
    
    if(e.target.classList.contains('ballon_address')) {
        console.log("Link clicked");
        console.log(clusterer.getGeoObjects());
        let clusterizedObjects = clusterer.getGeoObjects();
        let coords = e.target.dataset.coords;
        console.log(coords);
        console.log(...clusterizedObjects[0].properties.get('coordinates'));
     

        let elemOfSameAddress = clusterizedObjects.filter(elem => {
            let strOfCoords = elem.properties.get('coordinates').join();
             if(strOfCoords === coords) {
                 return elem;
             }
        });

        let reviewsToRender = [];
         for(let elem of elemOfSameAddress) {

            reviewsToRender.push(elem.properties.get('review'));

         }
        

        console.log(elemOfSameAddress);
        console.log(elemOfSameAddress[0].properties.get('review'));
        console.log(reviewsToRender);

        clearComments(reviews);    
        form.classList.add('active');
        reviews.innerHTML = render({'reviews': reviewsToRender});
        clusterer.balloon.close();
      
    }
})

///////////////////////////////////////////////////////////////////////////////

    function init() {

        myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 9
        }, {
            balloonMaxWidth: 200,
            searchControlProvider: 'yandex#search'
        });

        var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
                '<a href="#" data-coords={{properties.coordinates}} class=ballon_address>{{ properties.balloonContentLink|raw }}</a>' +
                '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
                '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );


        
         clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: customItemContentLayout
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
            addressFromCoords = data.geoObjects.get(0).getAddressLine();
            address.innerText = addressFromCoords;
            reviewBuffer = [];

        } catch (e) {
            console.log(e);
        }


    });

    myMap.geoObjects.events.add('click', function (e) {

        let reviewOfCurrentPlace = [];
     
        var object = e.get('target');
        if(e.get('target').options.getName() === 'geoObject') {

            reviewOfCurrentPlace.push(e.get('target').properties.get('review'));
            clearComments(reviews); 
            form.classList.add('active');
            reviews.innerHTML = render({'reviews': reviewOfCurrentPlace});



            console.log('placemark click');
            console.log(e.get('target'));
            console.log(e.get('target').options.getName());
        }

    });

    }
})