import './style/styles.css';

import render from './templates/review.hbs';

// const map = document.querySelector('.map');

document.addEventListener('DOMContentLoaded', function () {

    let temporaryPlacemark;
    let coords;
    let allPlacemarks = [];
    // let currentMark;
    let form = document.querySelector('.form');
    let modal = document.querySelector('.form-overlay');
    const nameInput = document.querySelector('.comment-form__name');
    const placeInput = document.querySelector('.comment-form__place');
    const messageInput = document.querySelector('.comment-form__comment');
    const reviews = document.querySelector('.form__reviews');
    let review = [];
    let map = document.querySelector('.map');

    new Promise(resolve => ymaps.ready(resolve))
        .then(() => init());

    // ymaps.ready(init);
    let myMap;
    let clusterer;



    function addComment(author, place, comment) {

    }


//////////////////////////////////////form event handlers/////////////////////////

const submitter = document.querySelector('.form__btn-submit');
submitter.addEventListener('click', (e) => {
    e.preventDefault();

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

        temporaryPlacemark.properties.set('review', {name: nameInput.value,
                                                    place: placeInput.value,
                                                    message: messageInput.value});
        
        temporaryPlacemark.properties.set('coordinates', coords);
        temporaryPlacemark.properties.set('id', Date.now());
        allPlacemarks.push(temporaryPlacemark);

        
        review.push({'name': nameInput.value,
                              'place': placeInput.value,
                              'message': messageInput.value});

        console.log(review[0]);
        
        reviews.innerHTML = render({'reviews': review});
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

    modal.classList.remove('active');
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

        myMap.events.add('click', async function (e) {
            let address = document.querySelector('.header__address');
            coords = e.get('coords');

            //(+)

            modal.classList.add('active');

            //  Positioning form 
            // let posLeft = e.pageX;
            // let posTop = e.pageY;
            // form.style.top = `${posTop}px`;
            // form.style.left = `${posLeft}px`;
            //(+)

            // console.log(getAddress(coords));
            // getAddress(coords).then((res) => {
            //     address.innerText = res;
            // });
            

            // let coords = e.get('coords');
            // myMap.geoObjects.add(
            //     new ymaps.Placemark(coords)
            // );
            // let dataFromForm = {'e':e};
        //    let myGeo = createNewPlaceMark(dataFromForm);

            
        // temporaryPlacemark = new ymaps.GeoObject({
        //     geometry: {
        //         type: 'Point',
        //         coordinates: e.get('coords')
        //     }

        // });
        // console.log(temporaryPlacemark);
        //here we can set data from form to our Placemark
        
        // temporaryPlacemark.properties.set('test', [1, 2, 3]);
        // let test = temporaryPlacemark.properties.get('test');

        // myMap.geoObjects.add(myGeo);

           console.log(temporaryPlacemark); 
        //    clusterer.add(myGeo);

            try {

                const data = await ymaps.geocode(coords);
                const str = data.geoObjects.get(0).getAddressLine();
                address.innerText = str;

            } catch (e) {
                console.log(e);
            }
            // console.log(data);
            // function getAddress(coords) {

            //     let myGeocoder = ymaps.geocode(coords);

            //     myGeocoder.then(function (res) {

            //         // firstGeoObject = firstGeoObject.getAddressLine();
            //         // В качестве контента балуна задаем строку с адресом объекта.

            //         let firstGeoObject = res.geoObjects.get(0);

            //         let str = firstGeoObject.getAddressLine();
            //         // return str;
            //        address.innerText = 123;

            //     });

            // }

        })

        // if (!myMap.balloon.isOpen()) {
        //     var coords = e.get('coords');

        //     myMap.balloon.open(coords, {
        //         contentHeader: 'Событие!',
        //         contentBody: '<p>Кто-то щелкнул по карте.</p>' +
        //         '<p>Координаты щелчка: ' + [
        //             coords[0].toPrecision(6),
        //             coords[1].toPrecision(6)
        //         ].join(', ') + '</p>',
        //         contentFooter: '<sup>Щелкните еще раз</sup>'
        //     });
        // } else {
        //     myMap.balloon.close();
        // }
    }
})