Package.describe({
	summary: "Funnel your ham"
});

Npm.depends({
	'smtp-protocol':'0.3.0',
	'seq':'0.3.5'

});

Package.on_use(function (api, where) {
	where = where || ['client', 'server'];
	api.use('mongo-livedata', where);
	api.use('startup', where);
	api.add_files('tratt.js','server');
	api.export('Funnels');
	api.export('test');
});