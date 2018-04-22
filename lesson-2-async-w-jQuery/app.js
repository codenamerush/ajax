/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
		    url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
		    headers:{
		    	Authorization: 'Client-ID c0a50ca5e35a61925bf1650e161bab67492517e27407a8a2e594787e75779075'
		    }
		}).done(addImage).fail(function(err) {
		requestError(err, 'article');
		});

		$.ajax({
		    url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=81e06ea02cf54f9e90048cd90758f5e7`
		}).done(addArticles).fail(function(err) {
		requestError(err, 'article');
		});


		function addImage(images) {
		    const firstImage = images.results[0];

		    responseContainer.insertAdjacentHTML('afterbegin', `<figure>
		            <img src="${firstImage.urls.small}" alt="${searchedForText}">
		            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
		        </figure>`
		    );
		}

		function addArticles (data) {
		let htmlContent = '';
		if(data.response && data.response.docs && data.response.docs.length > 1) {
			htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
					<h2><a href="${article.web_url}">${article.headline.main}</a></h2>
					<p>${article.snippet}</p>
				</li>`
				).join('') + '</ul>';
		} else {
			htmlContent = '<div class="error-no-articles">No articles available</div>';
			}

		responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }
    });
})();
