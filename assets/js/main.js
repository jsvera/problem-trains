// HTML References
const results = document.querySelector('p');
const formSendOne = $('#formOne');
const txtFormOne = $('#txtFormOne');
const respFormOne = document.querySelector('#respFormOne');
const formSendTwo = $('#formTwo');
const txtFormTwo = $('#txtFormTwo');
const respFormTwo = document.querySelector('#respFormTwo');
const formSendThree = $('#formThree');
const txtFormThree = $('#txtFormThree');
const respFormThree = document.querySelector('#respFormThree');
const formSendFour = $('#formFour');
const txtFormFour = $('#txtFormFour');
const respFormFour = document.querySelector('#respFormFour');
const formSendFive = $('#formFive');
const txtFormFive = $('#txtFormFive');
const respFormFive = document.querySelector('#respFormFive');

const towns = ['A', 'B', 'C', 'D', 'E'];
const graph = 'AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7';
var distances = [];
var matrixDistances = [];
var tripCount = 0;
var bestRoute = "";
var bestDistance = Infinity + 1;
var differentRoutesCount = 0;
var response = '';


/**
 * Convert graph to array/matrix
 */
function graphToArray() {
    var graphToArray = graph.replace(/ /g, '').split(',');
    graphToArray.forEach(item => {
        distances.push({ origin: item[0], destination: item[1], distance: parseInt(item[2]) });
    });
    towns.forEach(element => {
        matrixDistances.push({
            town: element,
            destinations: distances.filter(e => e.origin === element)
        });
    });
}

/**
 * Calculate distance of the route (Output 1-5)
 * @param {*} route Route for calculation
 * @returns Total distance or 'NO SUCH ROUTE' if not exist
 */
function calculateDistance(route) {
    let a = route.replace(/ /g, '').split('');
    let totalDistance = 0;
    a.slice(0, a.length - 1).forEach((i, index) => {
        let end = a[index + 1];
        var c = distances.find(d => {
            return (d.origin == i && d.destination == end);
        });
        if (c) {
            totalDistance += c.distance;
        } else {
            totalDistance = 0;
            return;
        }
    });
    return (totalDistance != 0) ? totalDistance : 'NO SUCH ROUTE';
}



/**
 * Get the number of trips between two Towns with a maximum number of stops (Output 6)
 * @param {*} end The end town
 * @param {*} route Current route
 * @param {*} maxStops Maximum of stops
 * @returns Number of trips
 */
function tripsBetweenTowns(end, route, maxStops) {
    if (route.length - 1 > maxStops) return;
    if (route.length > 1 && route.endsWith(end)) {
        tripCount++;
    }
    var lastChar = route.charAt(route.length - 1);
    var matrizB = matrixDistances.find(e => e.town === lastChar);
    for (var i = 0; i < matrizB.destinations.length; i++) {
        var newChar = matrizB.destinations[i].destination;
        tripsBetweenTowns(end, route + newChar, maxStops);
    }
}


/**
 * Get the number of trips between two Towns with an exact number of stops (Output 7)
 * @param {*} start Start town
 * @param {*} end Destination town
 * @param {*} stops Number of stops
 * @returns The number of trips
 */
function tripsBetweenTownsWithStops(start, end, stops) {
    var lastRoute = start;
    for (var stop = 0; stop < stops; stop++) {
        var route = "";
        for (var i = 0; i < lastRoute.length; i++) {
            var c = lastRoute.charAt(i);
            var matrizB = matrixDistances.find(e => e.town === c);
            for (var j = 0; j < matrizB.destinations.length; j++) {
                route = route + matrizB.destinations[j].destination;
            }
        }
        lastRoute = route;
    }
    // console.log(lastRoute.split(end).length - 1);
    return (lastRoute.split(end).length - 1);
}

/**
 * Get the distance of the shortest route (Output 8-9)
 * @param {*} end Destination town
 * @param {*} route Current route
 * @param {*} distance Current distance
 * @returns 
 */
function getShortRoute(end, route, distance) {
    if (route.endsWith(end) && distance < bestDistance && distance > 0) {
        bestRoute = route;
        bestDistance = distance;
        return;
    }
    var lastChar = route.charAt(route.length - 1);
    var matrizB = matrixDistances.find(e => e.town === lastChar);
    for (var i = 0; i < matrizB.destinations.length; i++) {
        var newChar = matrizB.destinations[i].destination;
        var newCost = matrizB.destinations[i].distance;
        if (route.indexOf(newChar) > 0)
            continue;
        getShortRoute(end, route + newChar, distance + newCost);
    }
}

/**
 * Get the number of different routes between two towns with maximum distance (Output 10)
 * @param {*} end Destination town
 * @param {*} route Current route
 * @param {*} distance Current distance
 * @returns 
 */
function getDifferentRoutes(end, route, distance) {
    if (distance >= 30) {
        return;
    }
    if (distance > 0 && route.endsWith(end)) {
        // console.log(route + ", " + distance);
        differentRoutesCount++;
    }
    var lastChar = route.charAt(route.length - 1);
    var matrizB = matrixDistances.find(e => e.town === lastChar);
    for (var i = 0; i < matrizB.destinations.length; i++) {
        var newChar = matrizB.destinations[i].destination;
        var newCost = matrizB.destinations[i].distance;
        getDifferentRoutes(end, route + newChar, distance + newCost);
    }
}

//####################### **MAIN** ##########################
graphToArray();

//Output 1-5
var consultas = ['ABC', 'AD', 'ADC', 'AEBCD', 'AED'];
consultas.forEach((e, i) => {
    response += `Output #${i+1}: ${calculateDistance(e)} \n`;
});
//Output 6
tripsBetweenTowns("C", "C", 3);
response += `Output #6: ${tripCount} \n`;
//Output 7
var tripCountStops = tripsBetweenTownsWithStops("A", "C", 4);
response += `Output #7: ${tripCountStops} \n`;
//Output 8
getShortRoute("C", "A", 0);
response += `Output #8: ${bestDistance} (${bestRoute}) \n`;
//Output 9
bestRoute = '';
bestDistance = Infinity + 1;
getShortRoute("B", "B", 0);
response += `Output #9: ${bestDistance} (${bestRoute}) \n`;
//Output 10
getDifferentRoutes("C", "C", 0);
response += `Output #10: ${differentRoutesCount} \n`;

//Print Response with default entries
results.innerText = response;


/**
 * Form Distance of the route
 */
formSendOne.on('submit', function(e) {
    e.preventDefault();
    if (txtFormOne.val().trim().length <= 1) {
        return;
    }
    var resp = `${calculateDistance(txtFormOne.val())} \n`;
    respFormOne.innerText = resp;
});

/**
 * Form number of trips between two towns with a maximum of stops
 */
formSendTwo.on('submit', function(e) {
    e.preventDefault();
    if (txtFormTwo.val().trim().length !== 3) {
        return;
    }
    var text = (txtFormTwo.val().trim()).split('');
    tripCount = 0;
    tripsBetweenTowns(text[1], text[0], text[2]);
    respFormTwo.innerText = tripCount;
});

/**
 * Form the number of trips between two Towns with an exact number of stops
 */
formSendThree.on('submit', function(e) {
    e.preventDefault();
    if (txtFormThree.val().trim().length !== 3) {
        return;
    }
    var text = (txtFormThree.val().trim()).split('');
    tripCount = 0;
    respFormThree.innerText = `${tripsBetweenTownsWithStops(text[0], text[1], text[2])}`;
});

/**
 * Form the distance of the shortest route
 */
formSendFour.on('submit', function(e) {
    e.preventDefault();
    if (txtFormFour.val().trim().length <= 1) {
        return;
    }
    var text = (txtFormFour.val().trim()).split('');
    bestRoute = '';
    bestDistance = Infinity + 1;
    getShortRoute(text[1], text[0], 0);
    respFormFour.innerText = bestDistance;
});

/**
 * Form the number of different routes between two towns with maximum distance
 */
formSendFive.on('submit', function(e) {
    e.preventDefault();
    if (txtFormFive.val().trim().length <= 1) {
        return;
    }
    var text = (txtFormFive.val().trim()).split('');
    differentRoutesCount = 0;
    getDifferentRoutes(text[1], text[0], 0);
    respFormFive.innerText = differentRoutesCount;
});