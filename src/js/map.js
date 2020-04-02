(function (data) {
    'use strict';

    window.gtr = window.gtr || {};

    const geolocation = function (next) {
        if (!navigator.geolocation) {
            next("not supported");
        } else {
            navigator.geolocation.getCurrentPosition(function (data) {
                next(null, {
                    lat: data.coords.latitude,
                    lon: data.coords.longitude
                });
            }, function (err) {
                next(err);
            });
        }
    };

    const rad = function (deg) {
        return deg * Math.PI / 180;
    };

    const deg = function (rad) {
        return rad * 180 / Math.PI;
    };

    //using haversine formula
    //ref: http://en.wikipedia.org/wiki/Haversine_formula
    const calculateDistanceBetwenPoints = function (p1, p2) {
        const R = data.MEAN_EARTH_RADIUS_METERS;

        const phi1 = rad(p1.lat());
        const lambda1 = rad(p1.lng());
        const phi2 = rad(p2.lat());
        const lambda2 = rad(p2.lng());

        const deltaLat = phi2 - phi1;
        const deltaLon = lambda2 - lambda1;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    //using haversine formula
    //ref: http://en.wikipedia.org/wiki/Haversine_formula
    var calculatePoint = function (p1, bearingDegrees, distanceMeters) {
        const R = data.MEAN_EARTH_RADIUS_METERS;
        const d = distanceMeters;

        const theta = rad(bearingDegrees); // bearing in radians
        const sigma = d / R; //angular distance

        const phi1 = rad(p1.lat());
        const lambda1 = rad(p1.lng());

        const phi2 = Math.asin(Math.sin(phi1) * Math.cos(sigma) + Math.cos(phi1) * Math.sin(sigma) * Math.cos(theta));
        const lambda2 = lambda1 + Math.atan2(Math.sin(theta) * Math.sin(sigma) * Math.cos(phi1), Math.cos(sigma) - Math.sin(phi1) * Math.sin(phi2));

        const lat = deg(phi2);
        const lon = deg(lambda2);

        return new google.maps.LatLng(lat, lon);
    };

    const drawCircle = function (map, lat, lon, radius, color, strokeWeight, strokeOpacity) {
        const options = {
            draggable: false,
            editable: false,
            strokeColor: color,
            strokeOpacity: strokeOpacity || 0.75,
            strokeWeight: strokeWeight || 1,
            fillOpacity: 0,
            map: map,
            center: new google.maps.LatLng(lat, lon),
            radius: radius
        };
        return new google.maps.Circle(options);
    };

    const createOverlay = function (map, bounds, url, opacity) {
        const options = {
            opacity: opacity || 1.0
        };
        const overlay = new google.maps.GroundOverlay(url, bounds, options);
        overlay.setMap(map);
        return overlay;
    };

    const removeOverlay = function (overlay) {
        overlay.setMap(null);
    };

    const renderMap = function (center, next) {
        const options = {
            zoom: 4,
            center: center,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.LARGE,
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },

            streetViewControl: false,
            panControl: false,
            styles: [
                {
                    "stylers": [
                        {"hue": "#0099ff"}, {"visibility": "simplified"},
                        {"saturation": -48},
                        {"weight": 0.4},
                        {"gamma": 0.78},
                        {"lightness": 8}
                    ]
                }
            ]
        };
        const map = new google.maps.Map(document.getElementById('map-canvas'), options);
        next(map);
    };

    const addMarker = function (map, position, title, color, draggable) {
        return new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            draggable: draggable,
            icon: {
                path: 'M8,0C4.687,0,2,2.687,2,6c0,3.854,4.321,8.663,5,9.398C7.281,15.703,7.516,16,8,16s0.719-0.297,1-0.602  C9.679,14.663,14,9.854,14,6C14,2.687,11.313,0,8,0z M8,10c-2.209,0-4-1.791-4-4s1.791-4,4-4s4,1.791,4,4S10.209,10,8,10z M8,4  C6.896,4,6,4.896,6,6s0.896,2,2,2s2-0.896,2-2S9.104,4,8,4z',
                //path: 'M648 1169 q117 0 216 -60t156.5 -161t57.5 -218q0 -115 -70 -258q-69 -109 -158 -225.5t-143 -179.5l-54 -62q-9 8 -25.5 24.5t-63.5 67.5t-91 103t-98.5 128t-95.5 148q-60 132 -60 249q0 88 34 169.5t91.5 142t137 96.5t166.5 36zM652.5 974q-91.5 0 -156.5 -65 t-65 -157t65 -156.5t156.5 -64.5t156.5 64.5t65 156.5t-65 157t-156.5 65z',
                //size: new google.maps.Size(20,32),
                //origin: new google.maps.Point(0,0),
                fillColor: color,
                fillOpacity: 0.95,
                //scale: .025,
                scale: 2,
                strokeColor: color,
                strokeOpacity: 0.95,
                strokeWeight: 1,
                anchor: new google.maps.Point(8, 15)
            }
        });
    };

    const removeMarker = function (marker) {
        marker.setMap(null);
    };

    gtr.map = {
        geolocation: geolocation,
        drawCircle: drawCircle,
        calculateDistanceBetwenPoints: calculateDistanceBetwenPoints,
        calculatePoint: calculatePoint,
        createOverlay: createOverlay,
        removeOverlay: removeOverlay,
        renderMap: renderMap,
        addMarker: addMarker,
        removeMarker: removeMarker
    };

}(gtr.data));
