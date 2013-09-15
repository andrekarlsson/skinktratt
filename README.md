## Still todo:

###tratt

* see if mx wildcards work
* control that alias exists before relaying mail
* see what needs to be set in mail to not be spam

###frontend

* statistics
  * mail count
     * per alias
     * overall
     * mean per alias
     * reset
* aliases
  * create
  * disable
  * delete
  * rename 
* settings
  * forwarding adress 
* home
  * show summary of active aliases with mail count
  * show how many mails sent since last login
  	* to the user
  	* to top aliases 


#skinktratt

A mail proxy service where the user can create a aliases and be able to use alias@user.skinktratt-domain.com as email address. The mails will be forwarded to a address given by the user.

the point with this is that you can:
 
 * use separate emails for each service you sign up to find out which evil bastard sold your address to Russia.
 
 * get statistics on how many mails you get on each alias
 
 * easily disable an alias (this means that when the russian mails start rolling in, you won't have to change your real address)

##Setup
Skinktratt is to be run on your own infrastructure and is a meteor application.
So you need:

* node
* mongodb

You also need to set a mx entry with a wildcard

!!!ACHTUNG!!!! THIS IS ONLY A EXAMPLE EXAMPLE, DON'T KNOW IF IT WORKS… YET.

	*.yourdomain.               3600     MX    10 host.yourdomain.
This will route emails alias@user.yourdomain.com to your mail server

