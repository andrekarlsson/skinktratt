Package.describe({
	summary: "Foundation Icon Fonts 3, http://zurb.com/playground/foundation-icon-fonts-3"
});

Package.on_use(function (api){
	api.add_files('foundation-icons.css', 'client');
	api.add_files('foundation-icons.eot', 'client');
	api.add_files('foundation-icons.svg', 'client');
	api.add_files('foundation-icons.ttf', 'client');
	api.add_files('foundation-icons.woff', 'client');
});