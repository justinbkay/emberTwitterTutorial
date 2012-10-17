App = Em.Application.create();

App.SearchTextField = Em.TextField.extend({
  insertNewline: function() {
    App.tweetsC.loadTweets();
  }
});

App.Tweet = Em.Object.extend({
    profilePic: null,
    username: null,
    date: null,
    text: null
});

App.tweetsV = Em.View.extend({
});

App.tweetsC = Em.ArrayController.create({
    content: [],
    term: '',
    loader: false,
    firstRun: true,
    limit: false,
    
    loadTweetsCompleted: function(xhr) {
      if(xhr.status == 400 || xhr.status == 420) {
        this.set('limit', true);
      }
    },
    
    loadTweetsSucceeded: function(data) {
      var tweets = data.results;
      this.set('content', []);
      tweets.forEach(function(tweetData) {
        var d = new Date(tweetData.created_at);
        var ago = $.timeago(d);
        var tweet = App.Tweet.create({
          profilePic: tweetData.profile_image_url,
          username: tweetData.from_user,
          date: ago,
          text: tweetData.text
        });
        this.pushObject(tweet);
      }, this);

      this.set('loader', false);
    },
    
    loadTweets: function() {
      var term = this.get('term'),
          first = this.get('firstRun');
      //show loader
      this.set('loader', true);
      //no longer the first run.
      if(first == true)
        this.set('firstRun', false);

      if ( term ) {
        var url = 'http://search.twitter.com/search.json?q=%@&rpp=15&include_entities=true&result_type=recent&callback=?'.fmt(encodeURIComponent(this.get('term')));
        $.ajax({
          url: url,
          dataType: 'JSON',
          context: this,
          success: this.loadTweetsSucceeded,
          complete: this.loadTweetsCompleted
        });
      }
    }
});
