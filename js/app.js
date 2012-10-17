App = Em.Application.create();

App.SearchTextField = Em.TextField.extend({
    insertNewline: function() {
        App.tweetsC.loadTweets();
    }
});

App.Tweet = Em.Object.extend({
    profile_pic: null,
    user_name: null,
    date: null,
    text: null
});

App.tweetsV = Em.View.extend({
	loaderBinding: 'App.tweetsC.loader',
	firstRunBinding: 'App.tweetsC.firstRun',
	limitBinding: 'App.tweetsC.limit'
});

App.tweetsC = Em.ArrayController.create({
    content: [],
    term: '',
    loader: false,
    firstRun: true,
    limit: false,
    loadTweets: function() {
      var me = this;
      var term = me.get('term');
      var first = me.get('firstRun');
      //show loader
      me.set('loader', true);
      //no longer the first run.
      if(first == true)
        me.set('firstRun', false);

      if ( term ) {
        var url = 'http://search.twitter.com/search.json?q=%@&rpp=15&include_entities=true&result_type=recent&callback=?'.fmt(encodeURIComponent(me.get('term')));
        $.ajax({
          url: url,
          dataType: 'JSON',
          success: function(data) {
            var tweets = data.results;
            me.set('content', []);
            $(tweets).each(function(index,tweet){
              //Reformat date
              var d = new Date(tweet.created_at);
              var ago = $.timeago(d);
              var t = App.Tweet.create({
                profile_pic: tweet.profile_image_url,
                user_name: tweet.from_user,
                date: ago,
                text: tweet.text
              });
              me.pushObject(t);
            });
            me.set('loader', false);
          },
          complete: function(xhr) {
            if(xhr.status == 400 || xhr.status == 420) {
              me.set('limit', true);
            }
          }
        });
      }
    }
});
