if(Meteor.isServer){

	Funnels.allow({
	  insert: function (userId, doc) {
	    // the user must be logged in, and the document must be owned by the user
	    return (userId && doc.owner === userId);
	  },
	  update: function (userId, doc, fields, modifier) {
	    // can only change your own documents
	    return doc._id === userId;
	  },
	  remove: function (userId, doc) {
	    // can only remove your own documents
	    return doc._id === userId;
	  }
	});

	Meteor.publish('app', function(){
		return Funnels.find(this.userId)
	});

	Meteor.methods({
		registered: function(username){
			if(Meteor.users.find({username:username}).count() > 0)
				return true
			else
				return false
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
			e.stopPropagation();
			var email = $('#to_email').val();
			Funnels.update(Meteor.userId(), {$set: {to_email: email}});
			Session.set('settingsAlert', true);
			Meteor.setTimeout(function() { Session.set('settingsAlert', false);}, 2000);
			return false;
			
		}
	});

	Template['settings'].helpers({
		email: function () {
			return Funnels.findOne({}).to_email
		},
		settingsAlert: function(){
			return Session.get('settingsAlert') 
		}
	});

	Template['nav'].events({
		'click .pages li': function (e, tmpl) {
			$('.pages').find('.active').removeClass('active')
			$(e.target).parent().toggleClass('active');
			
			var id = $(e.target).prop('hash');
			Session.set('activePage', id.split('#')[1])

		},
		'click .actions li': function(e){
			Meteor.logout();
		}
	});

	Template['main'].helpers({
		visibility: function (pageId) {
			if(Session.get('activePage') === pageId)
				return 'visible'
			else
				return 'hidden'
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