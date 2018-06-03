import './style/styles.css'
// const map = document.querySelector('.map');

document.addEventListener('DOMContentLoaded', function() {
    
    new Promise(resolve => ymaps.ready(resolve))
        .then(() => init());
  
    // ymaps.ready(init);
    var myMap;

    function init() {     
        myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 9
        },
        {
            balloonMaxWidth: 200,
            searchControlProvider: 'yandex#search'
        });
    
        myMap.events.add('click', function (e) {
            
            var coords = e.get('coords');
            
            function getAddress(coords) {
                ymaps.geocode(coords).then(function (res) {
                    var firstGeoObject = res.geoObjects.get(0);

                    // В качестве контента балуна задаем строку с адресом объекта.
                    console.log(firstGeoObject.getAddressLine());
 //                   console.log(iconCaption);
                });

            }

            console.log(getAddress(coords));
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

