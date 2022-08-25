const DADATA_SUGGESTION_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const DADATA_TOKEN = "2ddbfbbb25756a8f4ac31a9c8d561591fdc77cf6";
const NO_SUGG = 'No suggestions';
const DB_IP_URL = 'https://api.db-ip.com/v2/free/self';
const DADATA_CITY_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=";

const form = document.getElementById('test_task_form');
const ip_input_element = form.querySelector('.ip');
const city_input_element = form.querySelector('.city');
const filter_input_element = form.querySelector('.filter');
const combobox = document.getElementById('suggestions');

const empty_option = document.createElement('option')
empty_option.innerHTML = NO_SUGG;
empty_option.value = NO_SUGG;
combobox.appendChild(empty_option);

getCityByIP()

filter_input_element.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        var query_json = {
            url: DADATA_SUGGESTION_URL,
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + DADATA_TOKEN
            },
            body: JSON.stringify({query: city_input_element.value + ' ' + filter_input_element.value})
        }
        fetch(DADATA_SUGGESTION_URL, query_json)
        .then(response => response.json())
        .then(result => makeSuggestionsList(result))
        .catch(error => console.log("Error: ", error));
    }
})

async function getIP(){
    return $.getJSON(DB_IP_URL, function(response_data) { // Show IP immediately
        ip_input_element.value = response_data.ipAddress
    });
}

async function getCityByIP(){
    let user_ip_info = await getIP()
    var query_json = {
        url: DADATA_CITY_URL + user_ip_info.ipAddress,
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + DADATA_TOKEN
        }
    }
    $.getJSON(query_json, function(response_data) {
        city_input_element.value = response_data.location.value
    });
}

function makeSuggestionsList(suggestions_json){
    $(combobox).empty(); // Refresh suggestions list
    if (suggestions_json.suggestions.length == 0){
        combobox.appendChild(empty_option)
        return
    }
    suggestions_json.suggestions.forEach(value_json =>{
        var option = document.createElement('option');
        option.innerHTML = value_json.value;
        option.value = value_json.value;
        combobox.appendChild(option);
    })
}
