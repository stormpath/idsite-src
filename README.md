# Stormpath ID Site Source #

[Stormpath](http://stormpath.com/) is a User Management API that reduces
development time with instant-on, scalable user infrastructure. Stormpath's
intuitive API and expert support make it easy for developers to authenticate,
manage, and secure users and roles in any application.

This is the development environment for the Stormpath hosted ID Site.  You can
fork this repository and use it to build the same single page application (SPA)
that Stormpath provides by default, and you can make any changes that you
require for your custom version.

This default application is built with Angular and has default views and styling.
If you need to make significant changes that don't fit within this application,
you may want to use [Stormpath.js][] instead.  That is a smaller library that
gives you the necessary Stormpath APIs to do user management, but does not come
with pre-built views or styling.

## Browser Support

This ID Site application will work in the following web browser environments:

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

**Note**: At this time, only node version `4.x` is supported.

You should clone this repository and then run this within the repository:

```sh
npm install
bower install
```

## Getting started with `ez_dev`

Within this repository, there's a script called `ez_dev.sh`. This will setup a complete development environment for you
to be able to work on your ID Site application.

Before we get into running the script, let's take a step back to see what `ez_dev` sets up. If you want to jump right
in, go to the [running ez_dev](#running-ez_dev) section.

A typical flow for using ID Site is the following:

1. Your make a request of the `/login` endpoint of your application in the browser.
2. Your application redirects the browser to Stormapth (api.stormpath.com/sso).
3. Stormpath redirects the browser to your ID Site, as configured in the Stormpath Admin Console.
4. The ID Site application loads in your browser and presents the login form.
5. After login or registration, your browser is directed back to the server from step 1.

When customizing ID Site on your local machine, you need:

* A web server to handle steps 1 and 5
* A web server to serve the assets at step 4, that would usually be handled by Stormpath.
* SSL encryption for step 3, as required by Stormpath.

The `ez_dev` script sets up the necessary architecture needed. The components are:

1. `fakesp` - A web server that will handle steps 1 and 5.
2. `localtunnel.me` - A free service that sets up an HTTPS proxy from the public internet to a locally running server.
3. `grunt serve` - A locally running instance of ID Site.

Once this is all running, you browser will automatically open up to: `http://localhost:8001` and you will be able to see the
updated ID Site content you are working on. Any saved changes to the ID Site content are immediately reflected in your browser
when you go to an ID Site view (such as `/login`).

Here's a visual representation of what is setup and the flow of the requests.

![tunnel architecture][tunnel_image]

### Running `ez_dev`

`ez_dev` needs to know the following:

1. Your Stormpath API Key ID
2. Your Stormpath API Key secret
3. Your Stormpath Application HREF

The script will look for some common environment variables and file locations in this order:

1. If `STORMPATH_API_KEY_FILE` is set, it will get the API Key ID and API Key Secret from that file
2. If `~/.stormpath/apiKey.properties` exists, it will get the API Key ID and API Key Secret from that file
3. If `STORMPATH_APPLICATION_HREF` is set, it will use that value for the Stormpath Application to connect to

If neither 1. or 2. above is met, you will be asked to provide the API Key ID and the API Key Secret to the script

If 3. above is not met, you will be asked to provide the Application HREF. *Note*: You can leave this value blank if
you only have the default application (`My Application`) defined in your Stormpath tenant from when it was first setup.
If you have any other Applications defined, then you must specify the Application HREF.

Here are a few run scenarios:

```
./ez_dev.sh # may be asked to provide additional information
```

```
# explicit settings - you will not be asked for any additional information
STORMPATH_API_KEY_FILE=~/.stormpath/apiKey.mytenant.properties \
STORMPATH_APPLICATION_HREF=https://api.stormpath.com/v1/applications/stormpathidentifier123456 \
./ez_dev.sh
```

Note: The `ez_dev` script alters the ID Site settings in your Stormpath Admin Console. When you are done working on
ID Site, it is recommended that you go back to your Admin Console and revert the `Domain Name`,
`Authorized Javascript Origin URLs`, and `Authorized Redirect URLs` settings.

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
[Node.JS]: http://nodejs.org
[Stormpath Admin Console]: https://api.stormpath.com
[Stormpath.js]: https://github.com/stormpath/stormpath.js
[tunnel_image]: https://github.com/stormpath/idsite-src/blob/media/docs_images/idsite_tunnel_dev.png
