#Stormpath is Joining Okta
We are incredibly excited to announce that [Stormpath is joining forces with Okta](https://stormpath.com/blog/stormpaths-new-path?utm_source=github&utm_medium=readme&utm-campaign=okta-announcement). Please visit [the Migration FAQs](https://stormpath.com/oktaplusstormpath?utm_source=github&utm_medium=readme&utm-campaign=okta-announcement) for a detailed look at what this means for Stormpath users.

We're available to answer all questions at [support@stormpath.com](mailto:support@stormpath.com).

# Stormpath ID Site Source #

[Stormpath](http://stormpath.com/) is a User Management API that reduces
development time with instant-on, scalable user infrastructure. Stormpath's
intuitive API and expert support make it easy for developers to authenticate,
manage, and secure users and roles in any application.

This is the development environment for the Stormpath hosted ID Site.  You can
use this repository to build the same single page application (SPA) that
Stormpath provides by default.  The SPA uses Angular and Browserify and it is
built using Grunt and Yeoman.

If you want to build your own ID Site and are comfortable with Angular, you should
use this repository.

If you are not using Angular, you can build your own ID Site from scratch
but you will need to use [Stormpath.js][] in order to communicate with our API
from your custom ID Site application.

## Browser Support

ID Site will work in the following web browser environments:

* Chrome (all versions)
* Internet Explorer 10+
* Firefox 23+
* Safari 8+
* Android Browser, if Android version is 4.1 (Jellybean) or greater

## Installation

It is assumed that you have the following tools installed on your computer

* [Bower][]
* [Grunt][]
* [Node.JS][]
* [Localtunnel.me][]

You should clone this repository and these tasks within the repository:

```sh
npm install
bower install
```

## Setup an HTTPS proxy

Because ID Site only works with HTTPS, you will need to setup a local tunnel
which will serve your your local ID Site from a secure connection.  With the
local tunnel tool you must do this:

> lt --port 9000

It will fetch a URL and tell you something like this:

> your url is: https://wqdkeiseuj.localtunnel.me

You must take that URL and configure your ID Site accordingly.  Please login
to the [Stormpath Admin Console][] and set these options on your ID Site
Configuration:

| Configuration Option                   | Should be set to                                                                    |
|----------------------------------------|-------------------------------------------------------------------------------------|
| **Domain Name**                        | your local tunnel URL   |
| **Authorized Javascript Origin URLs**  |  your local tunnel URL should be in this list  |
| **Authorized Redirect URLs**           |  the endpoint on your server application which will receive the user after ID site (read below) |

## Your Service Provider (required)

The application (typically, your server) that sends the user to ID Site is known
as the Service Provider (SP).  You send the user to ID Site by constructing a
redirect URL with one of our SDKs.  For example, [createIdSiteUrl()][] in our
Node.js SDK.

After the user authenticates at ID Site, the user is redirected back to your
application.  Your application must have a callback URL which receives the user
and validates the `jwtResponse` parameter in the URL (our SDK does this work
for you).

If you haven't built your service provider we have a simple service provider
application which you can use for testing purposes, see: [Fake SP][]


## Startup

Once you have setup the environment (the steps above) you are ready to start
the development tasks.  Run the following command to start the server:

> grunt serve

This will open the application your browser.  Because the application does not
have a JWT request, you will see the JWT error.  At this point you should use
your service provider to redirect the user to your ID Site.


## Development Process - Stormpath Tenants

Do you use Stormpath?  Are you forking this repository so that you can build a
modified version of our default application?  This section is for you.

After you have started your environment (all the steps above) and made your
customizations to your fork of this  repository, there are two ways you can
deploy your changes:

* **Directly form your fork, unminified**.  If you've forked this library and your changes
exist in your fork, you can simply point your ID Site Configuration to the URL
of your forked github repository.  Nothing else is required, however you will
be serving un-minified assets, which may be slower.

* **With Minification**.  If you want to serve minified assets for performance,
you need to run `grunt build` to build the application into it's minified form.
This will be placed in the `dist/` folder, which is not tracked by git.  You
will need to commit this output to another github repository, and then point
your ID Site configuration at that git repository.

## Development Process - Stormpath Engineers

Are you a Stormpath Engineer who is working on this module?  This section is
for you.

You need to create a build of this application, after you have merged all of
your changes into master.  You create the build with the `grunt build` task.
After the build is created, you need to copy the output from the `dist/` folder
in this repo (which is not tracked by git) and commit it to the [ID Site Repository][].

The purpose of the [ID Site Repository][] is to hold the minified output of this
development environment.  When a tenant is using the default ID Site configuration,
they are receiving the files that exist in the [ID Site Repository][].

When you push a commit to master on the [ID Site Repository][], the files
are consumed and pushed to our CDN for serving to any tenant which is using the
default ID Site.

Are you working on a feature that is not yet ready for master, but you'd like a
tenant to try it out?  No problem! Just create a named topic branch in the
[ID Site Repository][] and place the build output there.  The tenant can then
point their ID Site Configuration at the branch for testing purposes.  When you
merge the feature into master and deploy a master release, you should delete
the branch.

In this situation, you'll likely want to use `grunt build:debug` to create a
non-obfuscated build output (which will make in-browser debugging easier).


### Testing

To run the Selenium tests, you need to install Protractor:

```
npm install -g protractor
```

Start the development server by running `grunt serve`,
then run Protractor with the config file in this repo:

```
protractor protractor.conf.js
```

**WARNING**: This will modify the ID Site Configuration of the Stormpath Tenant
that is defined by these environment variables:

```
STORMPATH_CLIENT_APIKEY_ID
STORMPATH_CLIENT_APIKEY_SECRET
```
Alas, you must ensure that you are using a tenant that is not used by your
production application!

## Copyright

Copyright &copy; 2014 Stormpath, Inc. and contributors.

This project is open-source via the [Apache 2.0
License](http://www.apache.org/licenses/LICENSE-2.0).

[Bower]: http://bower.io
[createIdSiteUrl()]: https://docs.stormpath.com/nodejs/api/application#createIdSiteUrl
[Fake SP]: https://github.com/robertjd/fakesp
[Grunt]: http://gruntjs.com
[ID Site Repository]: https://github.com/stormpath/idsite
[Localtunnel.me]: http://localtunnel.me/
[Node.JS]: http://nodejs.org
[Stormpath Admin Console]: https://api.stormpath.com
[Stormpath.js]: https://github.com/stormpath/stormpath.js
