# BuzzFeedChallenge
This here's a cross-browser compatible web app I made quickly over a weekend for a BuzzFeed Challenge where I had to clone the user comments (excluding Facebook comments) section (and allow pagination) from the BuzzFeed article found [here](http://www.buzzfeed.com/lorynbrantz/if-disney-princesses-had-realistic-waistlines#.bunk0vymNy)!

![screenshot](https://github.com/hdngo/BuzzFeedChallenge/blob/master/imgs/first.gif)

##Technologies Used
HTML, CSS, JavaScript, jQuery, BuzzFeed API

##Cross Browser Setup
Before opening the `index.html` file, make sure you enable CORS for your respective browser by doing the following:
###Chrome
-	Using the Allow-Control-Allow-Origin plugin, add the following Intercepted URL pattern: file:///foo*

###Firefox
-	Using the Cors-Everywhere plugin found here, simply go to the browser’s menu and enable the plugin. It should turn green when it’s enabled!

###Safari
-	First enable the developer menu by going to Preferences > Advanced, and checking the ‘Show Developer Menu…’ box.
-	Afterwards, go to Develop, and click on ‘Disable Local File Restrictions.’

###IE
-	Enable CORS requests by going to Internet options > Security > Custom level…, and check the Enable radio button under Miscellaneous.

