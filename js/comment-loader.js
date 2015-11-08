(function(){
	$(document).ready(function(){

		var ROOT_URL = "http://www.buzzfeed.com/";
		var BASE_API_URL = "http://www.buzzfeed.com/api/v1/comments/3494459";
		var BASE_MEDIA_URL = "http://s3-ak.buzzfeed.com";
		var TODAY = new Date($.now())
		
		var page;
		var Paginate = {

			settings: {
				comments: $('#comments'),
				loadButton: $('#load-button'),
				hasMoreComments: false
			},
			init: function(){
				page = this.settings;
			},
			getNextSet: function(url){
				var currentPage = this;
				var xhr = new XMLHttpRequest();
				xhr.open("GET", url, true);
				xhr.onreadystatechange = function() {
				  if (xhr.readyState == 4) {
				    var response = JSON.parse(xhr.responseText);
				    $.each(response.comments, function(index, comment){
				    	page.comments.append(Paginate.renderComment(comment));
				    	if(comment.children){
				    		Paginate.renderReplies(comment);
				    	}
				    })
				    if(response.paging["next"]){
				    	page.hasMoreComments = true;
				      page.loadButton.attr('href', BASE_API_URL + "?p=" + response.paging["next"]) ;
				    }
				    else{
				    	page.hasMoreComments = false;
				    }
			    	Paginate.toggleLoadButton();	
				  }
				}
				xhr.send();
			},
			bindUIActions: function(){
				page.loadButton.on("click", function(e){
					e.preventDefault();
					var nextPageURL = $(this).attr('href');
					Paginate.getNextSet(nextPageURL);
				})
			},
			toggleLoadButton: function(){
				if(page.hasMoreComments){
					page.loadButton.css("display", "block")
					page.loadButton.show();
				}
				else{
					page.loadButton.hide();
				}
			},
			renderComment: function(comment){
				if(comment.children){
					if(Paginate.hasReplies(comment).length > 0){
					return "<li class='comment thread' ><div class=comment-content >" + Paginate.renderUserData(comment) + Paginate.renderMedia(comment) + Paginate.renderBlurb(comment) + Paginate.renderReactions(comment) + "</div></li>";
					}
				}
				return "<li class=comment ><div class=comment-content >" + Paginate.renderUserData(comment) + Paginate.renderMedia(comment) + Paginate.renderBlurb(comment) + Paginate.renderReactions(comment) + "</div></li>";
			},
			renderUserData: function(comment){
				return "<div>" + Paginate.renderUserAvatar() + "<div class='post-info inline-bl' >" + Paginate.renderUserName(comment) + Paginate.renderPostDate(comment) + "</div></div>";
			},
			renderUserAvatar: function(){
				return "<img class='avatar inline-bl' src=./imgs/user.jpg />";
			},
			renderUserName: function(comment){
				return "<a href=" + ROOT_URL + comment.user_info.display_name + " >" + comment.user_info.display_name + " </a>";
			},
			renderPostDate: function(comment){
				var postDate = comment.added * 1000;
				return dateConversion(postDate);
			},
			renderMedia: function(comment){
				if(comment.url){
					return "<img src=" + BASE_MEDIA_URL + comment.url + " />";
				}
				else{
					return "";
				}
			},
			renderBlurb: function(comment){
				if(comment.blurb !== ""){
					return "<div><p class=blurb >" + comment.blurb + "</p></div>";
				}
				else{
					return "";
				}
			},
			hasReplies: function(comment){
				var filteredReplies = comment.children.filter(Paginate.hasBlurb);
				return filteredReplies;
			},
			hasBlurb: function(reply){
				return reply.blurb;
			},
			renderReplies: function(comment){
				var replies = Paginate.hasReplies(comment)
				if(replies.length > 0){
					var repliesList = $("<ul/>");
					repliesList.addClass("replies");
					$.each(replies, function(index, reply){
						repliesList.append(Paginate.renderComment(reply));
					})
					page.comments.append(repliesList);
				}
			},
			renderReactions: function(comment){
				var reactionsDiv = $("<div/>");
				reactionsDiv.addClass("reactions");
				reactionsDiv.append(Paginate.renderReactionType(comment, "love"));
				reactionsDiv.append(Paginate.renderReactionType(comment, "hate"));
				return reactionsDiv[0].outerHTML;
			},
			renderReactionType: function(comment, reactionType){
				var reactionCount = 0;
				if(comment[reactionType + "_count"]){
					reactionCount = comment[reactionType + "_count"];
				}
				return "<img class='reaction-icon inline-bl' src=./imgs/transparent_" + reactionType + "_small.png /><p class=inline-bl >" + reactionCount + "</p>";
			}
		}

		// date handling functions
		function dateConversion(dateAdded){
			var friendlyDateString;
			var postDate = new Date(dateAdded);
			var timeBetweenInSeconds = (TODAY - postDate) / 1000;
			var timeBetweenInHours = Math.floor(timeBetweenInSeconds / 3600);
			if(timeBetweenInHours < 24){
				friendlyDateString = handleDateString(timeBetweenInHours, "hours")
			}
			else{
				var timeBetweenInDays = Math.floor(timeBetweenInHours / 24);
				if(timeBetweenInDays < 7){
					friendlyDateString = handleDateString(timeBetweenInDays, "days")
				}
				else{
					var timeBetweenInWeeks = Math.floor(timeBetweenInDays / 7);
					if(timeBetweenInDays < 31){
						friendlyDateString = handleDateString(timeBetweenInWeeks, "weeks");
					}
					else{
						var timeBetweenInMonths = Math.floor(timeBetweenInDays / 31);
						friendlyDateString = handleDateString(timeBetweenInMonths, "months");
					}
				}
			}
			return friendlyDateString;
		}

		function handleDateString(dateValue, timeType){
			if(dateValue === 0 || dateValue === 1){
				return "<p>about " + dateValue + " " + timeType.substr(0, timeType.length - 1) + " ago";
			}
			else{
				return "<p>about " + dateValue + " " + timeType + " ago";
			}
		}

		// start app and initial rendering
		Paginate.init();
		Paginate.bindUIActions();
		Paginate.getNextSet(BASE_API_URL);

		// scrolling functionality
		$(window).scroll(function(){
			if($(window).scrollTop() > 0){
				$('#arrow-up').fadeIn(700);
			}
		})

		$('#arrow-up').on('click', function(){
			$("html, body").animate({
			 scrollTop:0
			 },"slow");
		})

	})

})();