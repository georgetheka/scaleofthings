(function () {
    'use strict';

    window.gtr = window.gtr || {};
    const MEAN_EARTH_RADIUS_METERS = 6378137;

    const sizes = {
        MANHATTAN: {
            name: "Manhattan",
            diameter_km: 7.681
        },
        FOOTBALL_FIELD: {
            name: "Football Field",
            diameter_km: 0.109728
        },
        HOUSE: {
            name: "House",
            diameter_km: 0.00795
        },
        CAR: {
            name: "Car",
            diameter_km: 0.004
        },
        REFRIGERATOR: {
            name: "Refrigerator",
            diameter_km: 0.0017
        },
        BASKETBALL: {
            name: "Basketball",
            diameter_km: 0.0002426
        },
        PING_PONG: {
            name: "Ping Pong Ball",
            diameter_km: 0.000038
        },
        PEA: {
            name: "Pea",
            diameter_km: 0.000007
        },
        GRAIN_SAND: {
            name: "Grain of Sand",
            diameter_km: 0.0000002
        },
    };

    const planets = {
        sun: {
            mean_distance_mkm: 0,
            eq_diameter_km: 1391684,
            color: 'rgb(216, 61, 27)',
            name: 'Sun',
        },
        mercury: {
            mean_distance_mkm: 57.9,
            eq_diameter_km: 4880,
            color: '#ababab',
            name: 'Mercury',
        },
        venus: {
            mean_distance_mkm: 108,
            eq_diameter_km: 12100,
            color: 'rgb(201, 175, 129)',
            name: 'Venus',
        },
        earth: {
            mean_distance_mkm: 150,
            eq_diameter_km: 12800,
            color: '#3594ff',
            name: 'Earth',
            satellites: {
                moon: {
                    mean_distance_mkm: 0.3844,
                    eq_diameter_km: 3476.28,
                    color: '#777777',
                    name: 'Moon'
                }
            }
        },
        mars: {
            mean_distance_mkm: 228,
            eq_diameter_km: 6790,
            color: 'rgb(239, 115, 26)',
            name: 'Mars',
            satellites: {
                phobos: {
                    mean_distance_mkm: 0.009376,
                    eq_diameter_km: 11.2667,
                    color: '#777777',
                    name: 'Phobos'
                },
                deimos: {
                    mean_distance_mkm: 0.0234632,
                    eq_diameter_km: 6.2,
                    color: '#777777',
                    name: 'Deimos'
                },
            }
        },
        ceres: {
            mean_distance_mkm: 414,
            eq_diameter_km: 490,
            color: '#aaaaaa',
            name: 'Ceres',
        },
        jupiter: {
            mean_distance_mkm: 778,
            eq_diameter_km: 143000,
            color: 'rgb(230, 159, 117)',
            name: 'Jupiter',
            satellites: {
                io: {
                    mean_distance_mkm: 0.4217,
                    eq_diameter_km: 1821.6,
                    color: '#777777',
                    name: 'Io'
                },
                europa: {
                    mean_distance_mkm: 0.6709,
                    eq_diameter_km: 1560.8,
                    color: '#777777',
                    name: 'Europa'
                },
                ganymede: {
                    mean_distance_mkm: 1.0704,
                    eq_diameter_km: 2634.1,
                    color: '#777777',
                    name: 'Ganymede'
                },
                callisto: {
                    mean_distance_mkm: 1.88827,
                    eq_diameter_km: 2410.3,
                    color: '#777777',
                    name: 'Callisto'
                },
            }
        },
        saturn: {
            mean_distance_mkm: 1430,
            eq_diameter_km: 120000,
            color: 'rgb(214, 189, 149)',
            name: 'Saturn',
            satellites: {
                mimas: {
                    mean_distance_mkm: 0.185539,
                    eq_diameter_km: 396,
                    color: '#777777',
                    name: 'Mimas'
                },
                enceladus: {
                    mean_distance_mkm: 0.237948,
                    eq_diameter_km: 504,
                    color: '#777777',
                    name: 'Enceladus'
                },
                tethys: {
                    mean_distance_mkm: 0.294619,
                    eq_diameter_km: 1062,
                    color: '#777777',
                    name: 'Tethys'
                },
                dione: {
                    mean_distance_mkm: 0.377396,
                    eq_diameter_km: 1123,
                    color: '#777777',
                    name: 'Dione'
                },
                rhea: {
                    mean_distance_mkm: 0.527108,
                    eq_diameter_km: 1527,
                    color: '#777777',
                    name: 'Rhea'
                },
                titan: {
                    mean_distance_mkm: 1.22187,
                    eq_diameter_km: 5150,
                    color: '#777777',
                    name: 'Titan'
                },
            }
        },
        uranus: {
            mean_distance_mkm: 2870,
            eq_diameter_km: 51800,
            color: 'rgb(130, 155, 164)',
            name: 'Uranus',
            satellites: {
                miranda: {
                    mean_distance_mkm: 0.12939,
                    eq_diameter_km: 471.6,
                    color: '#777777',
                    name: 'Miranda'
                },
                ariel: {
                    mean_distance_mkm: 0.19102,
                    eq_diameter_km: 1157.8,
                    color: '#777777',
                    name: 'Ariel'
                },
                umbriel: {
                    mean_distance_mkm: 0.2663,
                    eq_diameter_km: 1169.4,
                    color: '#777777',
                    name: 'Umbriel'
                },
                titania: {
                    mean_distance_mkm: 0.43591,
                    eq_diameter_km: 1576.8,
                    color: '#777777',
                    name: 'Titania'
                },
                oberon: {
                    mean_distance_mkm: 0.58352,
                    eq_diameter_km: 1522.8,
                    color: '#777777',
                    name: 'Oberon'
                },
            }
        },
        neptune: {
            mean_distance_mkm: 4500,
            eq_diameter_km: 49500,
            color: 'rgb(71, 120, 248)',
            name: 'Neptune',
            satellites: {
                triton: {
                    mean_distance_mkm: 2.1408,
                    eq_diameter_km: 2705.2,
                    color: '#777777',
                    name: 'Triton'
                },
            }
        },
        pluto: {
            mean_distance_mkm: 5900,
            eq_diameter_km: 3000,
            color: 'rgb(182, 142, 111)',
            name: 'Pluto',
            satellites: {
                charon: {
                    mean_distance_mkm: 0.017536,
                    eq_diameter_km: 1208,
                    color: '#777777',
                    name: 'Charon'
                },
            }
        },

    };

    const center = {lat: 40.758895, lng: -73.985131};

    gtr.data = {
        center: center,
        sizes: sizes,
        MEAN_EARTH_RADIUS_METERS: MEAN_EARTH_RADIUS_METERS,
        planets: planets
    };

}());
