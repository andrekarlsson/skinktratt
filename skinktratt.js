if(Meteor.isServer){

	Meteor.publish('app', function(){
		return Funnels.find({})
	});

	Meteor.methods({
		registered: function(username){
			if(Meteor.users.find({username:username}).count() > 0)
				return true
			else
				return false
		}
	});
	
}

if(Meteor.isClient){

	var pages = ['#home', '#aliases', '#stats', '#settings'];
	Meteor.subscribe('app', function(){
			console.log('done');
	});
	test = new Meteor.Collection("funnels");



	Template['settings'].events({
		'submit': function(e) {
			e.preventDefault();
			// var email = $('#email').val();
			 console.log(test.findOne({}))
			// if(App.find({userId: Meteor.userId()})){
			// 	App.update({userId: Meteor.userId()}, {$set: {toEmail: email}});
			// }else{
			// 	App.insert({
			// 		userId: Meteor.userId(),
			// 		toEmail: email,
			// 		aliases: []
			// 	})
			// }
			
		}
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

		},
		'click .actions li': function(e){
			Meteor.logout();
		}
	});

	Template['login'].events = {
		'blur #email': function(e){
			Meteor.call('registered', $('#email').val(), function(err, res){
				console.log(res)
				Session.set('registered', res);
			})
		},		
		'blur #password': function(e){
			Meteor.call('registered', $('#email').val(), function(err, res){
				console.log(res)
				Session.set('error', null);
			})
		},
		'submit': function(e){
			e.preventDefault();
			if(e.target.id == 'frm-login'){
				console.log('login')
				Meteor.loginWithPassword($('#email').val(), $('#password').val(), function(err){
					if(err){
						Session.set('error', 'loginError');
					}
				})
			}else{
				Accounts.createUser({
					password: $('#password').val(),
					email: $('#email').val(),
					username: $('#email').val(),
				}, function (err) {
					if(err){
						console.log('error creating user')
					}
				});
			}
			return false
		}

	}

	Template['login'].helpers({
		'registered': function(){
			return Session.get('registered');
		},
		'error': function(){
			return Session.get('error');
		}
	});	

}