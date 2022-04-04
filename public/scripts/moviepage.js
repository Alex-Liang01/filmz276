$(document).ready( function() {
	// get movie id
	var movie_id = window.location.href.split("movie/")[1];
	document.querySelector("#movie_id").value = movie_id;
	
	// get reviews
	var template = document.getElementsByTagName("template")[0];
	html = template.content.querySelector("div");
	var api = window.location.origin+"/api/movie/"+movie_id;
	$.getJSON(api, function(data) {
		if (data.success == "true") {
			$.each(data.reviews.rows, function(i, item) {
				template = document.importNode(html, true);
				template.querySelector(".filmz-name").textContent = item.firstname+item.lastname;
				//template.querySelector(".filmz-username").textContent = item.username;
				template.querySelector(".filmz-userreview").innerText = item.review_text;
				$(".reviewsection").append(template);
				if (template.querySelector(".filmz-userreview").offsetHeight > 100) {
					template.querySelector(".filmz-userreview").setAttribute('class', 'filmz-userreview hideContent');
					template.querySelector(".show-more").setAttribute('class', 'show-more text-white');
					template.querySelector(".show-more").addEventListener('click', showHide);
				}
				$(".filmz-stars").rateYo({
					maxValue: 10,
					numStars: 10,
					rating: item.rating,
					readOnly: true,
					starWidth: '20px'
				});
			})
			$.each(document.querySelectorAll('.resultcount'), function(i, item) {
				item.innerText = data.resultCount;
			})
			document.querySelector('#filmz-rating').innerText = Number(data.avgRating).toFixed(1);
		}
		else {
			document.querySelector('.resultcount').innerText = 0;
			document.querySelector('#filmz-rating').innerText = "0.0";
			document.querySelector('#reviews-header').innerText = "No reviews";
			$('#reviews-header').toggleClass('border-b');
		}
	})
	
	// change or set rating, show buttons
	$("#rateYo").rateYo({
		maxValue: 10,
		numStars: 10
	});
	var rating = "";
	$("#rateYo").rateYo().on("rateyo.change", function (e, data) {
		rating = data.rating;
		$(this).parent().find('input[name=rating]').val(rating);
	});
	$("#rateYo").rateYo().on("rateyo.set", function (e, data) {
		$('#filmz-overview').css("height", "5rem");
		$('#submit-review').show();
		$('#cancel-review').show();
		$('#create-rating-area').show();
	});
	
	// cancel review
	$('#cancel-review').click(function () {
		hideButtons();
	});
	
	// show submit button when
	$("#review").keyup(function () {
		$('#submit-review').show();
	});		
	
	// automatic textarea height adjustment
	$('.review-area').each(function () {
	  this.setAttribute('style', 'height:' + (this.scrollHeight+48) + 'px; overflow-y:hidden;');
	}).on('input', function () {
	  this.style.height = 'auto';
	  this.style.height = (this.scrollHeight) + 'px';
	});
	
	// long reviews
	function showHide() {
		$(this).parent().toggleClass('showContent');
		var replaceText = $(this).parent().hasClass('showContent') ? 'Show less' : 'Show more';
		$(this).text(replaceText);
	}
	
	
	function hideButtons() {
		$("#rateYo").rateYo("rating", 0);
		$('#submit-review').hide();
		$('#create-rating-area').hide();
		$('#cancel-review').hide();
		$('#filmz-overview').css("height", "11rem");
	}
})
