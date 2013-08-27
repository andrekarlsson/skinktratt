if(Meteor.isServer){
	var App = new Meteor.Collection("app");

	Meteor.publish('app', function(){
		return App.find({})
	})


	
}

if(Meteor.isClient){

	var pages = ['#home', '#aliases', '#stats', '#settings'];

	var App = Meteor.subscribe('app', function(){
		console.log('done');
	});

	Template['nav'].events({
		'click .pages li': function (e, tmpl) {
			$('.pages').find('.active').removeClass('active')
			$(e.target).parent().toggleClass('active');
			
			var id = $(e.target).prop('hash');

			pages.forEach(function (page) {
				$(page).css('display', 'none');
			});
			$(id).css('display', 'block');

		}
	});

}