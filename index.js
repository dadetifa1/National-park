'use strict';

const apiKey = 'CvkV2TRBnC3h3hI4djuPYUF75SVfPdezEhh0XHCP'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  $('#results-list').empty();

  // // iterate through the items array
  responseJson.data.forEach(park => {
      
    $('#results-list').append(
        `<li><h3>${park.fullName}</h3>
         <p>${park.description}</p>
         <p><a href="${park.url}">Park link</a></p>
         <p>${park.addresses[0] ? park.addresses[0].line1 : ''}</p>
         <p>${park.addresses[0] ? park.addresses[0].line2 : ''}</p>
         <p>${park.addresses[0] ? park.addresses[0].city : ''}</p>
         <p>${park.addresses[0] ? park.addresses[0].stateCode + " " + park.addresses[0].postalCode : ''}</p>
         </li>`
    );
  });
  
  //display the results section 
  $('#results').removeClass('hidden');
};

function getMatchingParks(query, maxResults=10) {

    const options = {
        headers: new Headers({
            "X-Api-Key": apiKey})
    };  
  const params = {
    stateCode: query,
    limit: maxResults
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

   console.log(url);

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getMatchingParks(searchTerm, maxResults);
  });
}

$(watchForm);