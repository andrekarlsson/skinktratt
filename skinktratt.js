if(Meteor.isServer){

	Funnels.allow({
	  insert: function (userId, doc) {
	    // the user must be logged in, and the document must be owned by the user
	    return (userId && doc.owner === userId);
	  },
	  update: function (userId, doc, fields, modifier) {
	    // can only change your own documents
	    
	    return doc.owner === userId;
	  },
	  remove: function (userId, doc) {
	    // can only remove your own documents
	    return doc.owner === userId;
	  },
	  fetch: ['owner']
	});

	Meteor.publish('app', function(){
		return Funnels.find({})
	});

	Meteor.methods({
		registered: function(username){
			if(Meteor.users.find({username:username}).count() > 0)
				return true
			else
				return false
		},
		updateToEmail: function(email){
			Funnels.update(Meteor.userId(), {$set: {to_email: email}});
		}
	});

	Accounts.onCreateUser(function(options, user) {
		var funnel = {
			_id: user._id,
			to_email: user.emails[0].address,
			aliases: []
		}
		Funnels.insert(funnel);
		return user;	
	});


	
}

if(Meteor.isClient){

	var pages = ['#home', '#aliases', '#stats', '#settings'];
	Meteor.subscribe('app')
	
	Funnels = new Meteor.Collection("funnels");


	Template['settings'].events({
		'submit': function(e) {
			e.preventDefault();
			var email = $('#email').val();

			Meteor.call('updateToEmail', $('#to_email').val())
			
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