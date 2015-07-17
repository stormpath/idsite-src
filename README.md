# Stormpath ID Site Source #

[Stormpath](http://stormpath.com/) is a User Management API that reduces development time with instant-on, scalable user infrastructure. Stormpath's intuitive API and expert support make it easy for developers to authenticate, manage, and secure users and roles in any application.

This is the development environment for the Stormpath hosted ID Site.  You can use this repository to build the same single page application (SPA) that Stormpath provides, or you can modify it to suit your needs.  The SPA uses Angular and Browserify and it is built using Grunt and Yeoman.

### Usage

It is assumed that you have Node.JS installed and that you have Bower and Grunt installed as global packages.

After cloning this repository you should run `npm install` and `bower install` within the repository

Then you can use the following grunt tasks:

* `grunt serve` will:
 * start the development server
 * load the application in your web browser
 * open a chrome instance for Karma tests to run in
 * watch files for edits and reload the application and re-run the tests
* `grunt build` will build the the application and place it in the `dist/` folder.  All assets will be minified.
* `grunt build:debug` will also build the application to `dist/`, but without minifying the javascript assets

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
Alas, you must ensure that you are using a tenant that is not userd with your
production application!

### Contributing

You can make your own contributions by forking the <code>development</code> branch, making your changes, and issuing pull-requests on the <code>development</code> branch.

We regularly maintain our GitHub repostiory, and are quick about reviewing pull requests and accepting changes!

### Copyright ###

Copyright &copy; 2014 Stormpath, Inc. and contributors.

This project is open-source via the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).