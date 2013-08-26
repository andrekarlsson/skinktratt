var smtp = Npm.require('smtp-protocol');
var seq = Npm.require('seq');
var fs = Npm.require('fs');
var s = Npm.require('stream');

var server = smtp.createServer(function (req) {
    // req.on('to', function (to, ack) {
    //     var domain = to.split('@')[1] || 'localhost';
    //     if (domain === 'andrek.se') ack.accept()
    //     else ack.reject()
    // });

    req.on('message', function (stream, ack) {
        var service = req.from.split('@')[0];
        var addToSubject = new s.Transform();
        
        addToSubject._transform = function(chunk, encoding, done) {
            var subject = chunk.toString().indexOf('Subject:');
            if(chunk.toString().indexOf('Subject') != -1)
            this.push('Subject: [' + service + '] ' + chunk.toString().substring(subject+8));
            done();
        };

        smtp.connect('smtp.tele2.se', 25, function (mail) {
            seq()
                .seq_(function (next) {
                    mail.on('greeting', function (code, lines) {
                        console.dir(lines);
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
        stream.pipe(addToSubject).pipe(process.stdout, { end : false });
        ack.accept();
    });

});

server.listen(9025);