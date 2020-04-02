$(function () {
    const showDetails = function () {
        footer.addClass('gt-expand');
        btnToggleDetails.find('span').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        resizeMap();
    };
    const renderSolarSystem = function () {
        //first let's remove all objects from the map
        removeMapObjects();

        const lat = center.lat;
        const lon = center.lng;

        const factor_km = size.diameter_km / planets.sun.eq_diameter_km;
        let lon_max = -Infinity;
        let lon_min = Infinity;
        let lat_max = -Infinity;
        let lat_min = Infinity;

        mapObjects = Object.keys(planets).reverse().map(function (name) {
            let marker;
            let circle;
            let overlay;
            const satellites = [];
            const planet = planets[name];
            //orbit radius in meters r:
            //  r = (actual distance in meters) * (km factor in meters)
            const r = (planet.mean_distance_mkm * 1e6) * (factor_km * 1e3);

            //deal with this later
            circle = maps.drawCircle(map, lat, lon, r, planet.color);
            const planetRadius = 0.5 * (planet.eq_diameter_km) * (factor_km) * 1e3;
            const planetCenter = maps.calculatePoint(
                new google.maps.LatLng(lat, lon),
                90,
                r);
            const url = "./images/" + name + ".png";
            marker = maps.addMarker(map, planetCenter, planet.name, planet.color, name === 'sun');
            google.maps.event.addListener(marker, 'dblclick', function () {
                const marker = this;
                Object.keys(mapObjects).forEach(function (k) {
                    const mapObject = mapObjects[k];
                    if (mapObject.marker === marker) {
                        map.panTo(mapObject.marker.position);
                        map.fitBounds(mapObject.overlay.getBounds());
                    }
                });
                changeState();
                showDetails();
            });
            if (name === 'sun') {
                google.maps.event.addListener(marker, 'dragstart', function () {
                    removeMapObjects('sun');
                    changeState();
                });
                google.maps.event.addListener(marker, 'dragend', function () {
                    const currentMarker = this;
                    center = {lat: currentMarker.position.lat(), lng: currentMarker.position.lng()};
                    renderSolarSystem();
                    changeState();
                });
            }
            const ne = maps.calculatePoint(
                planetCenter,
                (name === 'saturn' ? 62.5 : 45),
                planetRadius * (name === 'saturn' ? 2 : Math.sqrt(2)));
            const sw = maps.calculatePoint(
                planetCenter,
                (name === 'saturn' ? 242.5 : 225),
                planetRadius * (name === 'saturn' ? 2 : Math.sqrt(2)));
            const bounds = new google.maps.LatLngBounds(sw, ne);
            overlay = maps.createOverlay(map, bounds, url);
            if (planetCenter.lat() > lat_max) {
                lat_max = planetCenter.lat();
            }
            if (planetCenter.lat() < lat_min) {
                lat_min = planetCenter.lat();
            }
            if (planetCenter.lng() > lon_max) {
                lon_max = planetCenter.lng();
            }
            if (planetCenter.lng() < lon_min) {
                lon_min = planetCenter.lng();
            }
            if (planet.satellites) {
                Object.keys(planet.satellites).map(function (satelliteKey) {
                    const satellite = planet.satellites[satelliteKey];
                    const satelliteCenter = maps.calculatePoint(planetCenter, 90, 1e6 * satellite.mean_distance_mkm * factor_km * 1e3);
                    const satelliteRadius = 0.5 * (satellite.eq_diameter_km) * (factor_km) * 1e3;
                    const satellite_url = "./images/" + name + "_" + satelliteKey + ".png";
                    const satellite_circle = maps.drawCircle(map, planetCenter.lat(), planetCenter.lng(), satellite.mean_distance_mkm * 1e9 * factor_km, satellite.color, 1, 0.5);

                    const satellite_ne = maps.calculatePoint(
                        satelliteCenter,
                        45,
                        satelliteRadius * Math.sqrt(2));

                    const satellite_sw = maps.calculatePoint(
                        satelliteCenter,
                        225,
                        satelliteRadius * Math.sqrt(2));

                    const satellite_bounds = new google.maps.LatLngBounds(satellite_sw, satellite_ne);
                    const satellite_overlay = maps.createOverlay(map, satellite_bounds, satellite_url);

                    return {
                        circle: satellite_circle,
                        overlay: satellite_overlay
                    };
                });
            }

            return {
                name: name,
                marker: marker,
                overlay: overlay,
                circle: circle,
                satellites: satellites,
            };
        });

        map.fitBounds(new google.maps.LatLngBounds(
            new google.maps.LatLng(lat_min, lon_min),
            new google.maps.LatLng(lat_max, lon_max)
            )
        );

    };
    "use strict";

    let btnBack = $('#btnBack');
    let breadcrumb = $('#breadcrumb');
    let header = $('#header');
    let footer = $('#footer');
    let mapCanvas = $('#map-canvas');
    let btnToggleDetails = $('#toggle-details');

    let map;
    let maps = gtr.map;
    let sizes = gtr.data.sizes;
    let planets = gtr.data.planets;

    let mapObjects = [];

    let stateChanged;
    let center;
    let sizeKey;
    let size;
    let planet;
    let planetarySystem;
    let satellite;

    const reset = function () {
        stateChanged = false;
        center = gtr.data.center;

        sizeKey = 'FOOTBALL_FIELD';
        size = sizes[sizeKey];
        planet = null;
        planetarySystem = null;
        satellite = null;
    };

    const changeState = function () {
        if (!stateChanged) {
            $('#btnReset').show();
            stateChanged = true;
        }
    };

    const renderUi = function () {

        let renderSizesControl = function () {
            size = sizes[sizeKey];
            const sizeOptions = document.getElementById('sizeOptions');
            const sizeName = document.getElementById('sizeName');

            sizeName.innerHTML = size.name;

            //remove any existing elements
            [].slice.call(sizeOptions.childNodes).forEach(function (childNode) {
                sizeOptions.removeChild(childNode);
            });

            sizeOptions.appendChild($('<li class="dropdown-header">SHRINK THE SUN TO THE SIZE OF:</li>')[0]);
            sizeOptions.appendChild($('<li class="divider"></li>')[0]);

            Object.keys(sizes).forEach(function (key) {
                const current = sizes[key];
                const name = current.name;
                const diameter_km = current.diameter_km;
                let html = '<li style="width:40vw"><a href="#" data-key="' + key + '">';
                html += '<span class="pull-right text-muted">(' + diameter_km + ' km)' + '</span>';
                html += '<span style="' + (key === sizeKey ? 'font-weight: bold;' : '') + '">' + name + '</span>';
                html += '</a></li>';
                const node = $(html)[0];
                sizeOptions.appendChild(node);
            });

            renderSolarSystem();
        };


        let renderJumpControl = function () {
            let jumpOptions = document.getElementById('jumpOptions');

            //remove any existing items
            [].slice.call(jumpOptions.childNodes).forEach(function (childNode) {
                jumpOptions.removeChild(childNode);
            });

            jumpOptions.appendChild($('<li class="dropdown-header">Jump to:</li>')[0]);
            jumpOptions.appendChild($('<li class="divider"></li>')[0]);

            //render item
            if (!planet) {
                Object.keys(planets).forEach(function (key) {
                    let html = '<li style="width:25vw"><a href="#" data-key="' + key + '">';
                    html += planets[key].name;
                    html += '</a></li>';
                    const node = $(html)[0];
                    jumpOptions.appendChild(node);
                });
            } else if (planets[planet].satellites) {

                jumpOptions.appendChild($('<li><a href="#">Planetary System</a></li>')[0]);
                jumpOptions.appendChild($('<li><a href="#">' + planets[planet].name + ' (planet)</a></li>')[0]);
                jumpOptions.appendChild($('<li class="divider"></li>')[0]);
                jumpOptions.appendChild($('<li class="dropdown-header">Jump to:</li>')[0]);

                const satellites = planets[planet].satellites;
                Object.keys(planets[planet].satellites).forEach(function (key) {
                    let html = '<li style="width:25vw"><a href="#" data-key="' + key + '">';
                    html += satellites[key].name;
                    html += '</a></li>';
                    const node = $(html)[0];
                    jumpOptions.appendChild(node);
                });
            }
        };

        $('#sizeOptions').on('click', 'a', function (e) {
            e.preventDefault();
            changeState();
            sizeKey = $(this).attr('data-key');
            renderSizesControl();
        });

        btnBack.on('click', function (e) {
            e.preventDefault();
        });

        $('#jumpOptions').on('click', 'a', function (e) {
            e.preventDefault();
            changeState();
            const key = $(this).attr('data-key');
            const mapObject = mapObjects.filter(function (item) {
                return item.name === key;
            })[0];

            //pan to the planet center
            map.panTo(mapObject.marker.position);
            map.fitBounds(mapObject.overlay.getBounds());

            btnBack.removeClass('hide');
            breadcrumb = planets[key].name;
            planet = key;

            renderJumpControl();

            showDetails();
        });

        $('#btnCurrentLocation').on('click', function (e) {
            e.preventDefault();
            gtr.map.geolocation(function (err, position) {
                if (err) {
                    alert("could not determine your current location");
                } else {
                    changeState();
                    center = {lat: position.lat, lng: position.lon};
                    renderSolarSystem();
                }
            });

        });

        $('#btnReset').on('click', 'a', function (e) {
            e.preventDefault();
            reset();
            renderUi();
        });

        renderSizesControl();
        renderJumpControl();
    };

    const removeMapObjects = function (except) {
        except = except || '';
        mapObjects.forEach(function (o) {
            if (o.marker && o.name !== except) {
                o.marker.setMap(null);
            }
            if (o.circle) {
                o.circle.setMap(null);
            }
            if (o.overlay) {
                o.overlay.setMap(null);
            }
        });
    };


    const resizeMap = function () {
        const height = $(window.top).height() - 2 * header.height() - footer.height();
        mapCanvas.height(height);
    };


    const hideDetails = function () {
        footer.removeClass('gt-expand');
        btnToggleDetails.find('span').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        resizeMap();
    };

    window.addEventListener('resize', resizeMap);

    btnToggleDetails.on('click', function (e) {
        e.preventDefault();
        if ($(footer).hasClass('gt-expand')) {
            hideDetails();
        } else {
            showDetails();
        }
    });

    (function init() {
        reset();
        maps.renderMap(center, function (mapInstance) {
            map = mapInstance;
            resizeMap();
            renderUi();
        });
    }());
});
