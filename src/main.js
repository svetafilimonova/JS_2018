import './style/styles.css'
// const map = document.querySelector('.map');

document.addEventListener('DOMContentLoaded', function() {
    let map = document.querySelector('.map');

    map.addEventListener('click', function(e) {
     
        let form = document.querySelector('.form');
        let modal = document.querySelector('.form-overlay');

        modal.classList.add('active');
        //  Positioning form 
        // let posLeft = e.pageX;
        // let posTop = e.pageY;
        // form.style.top = `${posTop}px`;
        // form.style.left = `${posLeft}px`;

    });
    new Promise(resolve => ymaps.ready(resolve))
        .then(() => init());
  
    // ymaps.ready(init);
    let myMap;

    function init() { 

        myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 9
        },
        {
            balloonMaxWidth: 200,
            searchControlProvider: 'yandex#search'
        });

        let clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });

        myMap.geoObjects.add(clusterer);
    
        myMap.events.add('click', function (e) {
            let address = document.querySelector('.header__address');
            let coords = e.get('coords');

            // console.log(getAddress(coords));
            // getAddress(coords).then((res) => {
            //     address.innerText = res;
            // });
            let myGeo = new ymaps.GeoObject({
                geometry: {
                    type: 'Point',
                    coordinates: e.get('coords')
                },
                properties: {
                    hintContent: 'Москва',
                    ballonContentHeader: getAddress(coords),
                    balloonContentBody: 'Столица России',
                    population: 11848762
                }
            });

            myMap.geoObjects.add(myGeo);

            // let coords = e.get('coords');
            // myMap.geoObjects.add(
            //     new ymaps.Placemark(coords)
            // );

            clusterer.add(myGeo);
            
            function getAddress(coords) {
                let myGeocoder = ymaps.geocode(coords);

                myGeocoder.then(function (res) {
                    
                    // firstGeoObject = firstGeoObject.getAddressLine();
                    // В качестве контента балуна задаем строку с адресом объекта.
                  
                    let firstGeoObject = res.geoObjects.get(0);

                    let str = firstGeoObject.getAddressLine();
                    // return str;
                   address.innerText = str;
                    
                });

            }

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

