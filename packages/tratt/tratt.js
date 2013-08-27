var smtp = Npm.require('smtp-protocol');
var seq = Npm.require('seq');
var fs = Npm.require('fs');
var s = Npm.require('stream');
var Fiber = Npm.require('fibers');

Funnels = new Meteor.Collection("funnels");

var funnels = Funnels.find({});

var server = smtp.createServer(function (req) {
    req.on('to', function (to, ack) {
        Fiber(function() { 
        var domain = to.split('@')[1];
        var accept = false;
        
        funnels.forEach(function (funnel) {
            console.log(funnel)
            if(funnel.to_email.split('@')[1] === domain){
                accept = true;
            }
        });
        funnels.rewind();

        if(accept)
            ack.accept()
        else
            ack.reject()

        }).run()
    });

    req.on('message', function (stream, ack) {
        var alias = req.from.split('@')[0];

        smtp.connect('smtp.tele2.se', 25, function (mail) {
            seq()
                .seq_(function (next) {
                    mail.on('greeting', function (code, lines) {
                        next();
                    });
                })
                .seq(function (next) {
                    mail.helo('localhost', this.into('helo'));
                })
                .seq(function () {
                    mail.from(req.from, this.into('from'));
                })
                .seq(function () {
                    mail.to(req.to, this.into('to'));
                })
                .seq(function () {
                    mail.data(this.into('data'))
                })
                .seq(function () {
                    mail.message(stream.pipe(uppercase), this.into('message'));
                })
                .seq(function () {
                    mail.quit(this.into('quit'));
                })
                .seq(function () {
                    console.dir(this.vars);
                })
            ;
        });
        ack.accept();
    });

});

server.listen(9025);