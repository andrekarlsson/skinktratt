Package.describe({
	summary: "Funnel your ham"
});

Npm.depends({
	'smtp-protocol':'0.3.0',
	'seq':'0.3.5'

});

Package.on_use(function (api, where) {
	api.add_files('tratt.js','server');
});