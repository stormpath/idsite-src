## 0.4.2

Fix "Back to login" link, on registration view, to include trailing slash.

## 0.4.1

* Upgrade to `stormpath.js@0.6.2` for Enterprise/PD bug fix.

* Upgrade to `stormpath@0.18.2` for local testing.

## 0.4.0

* The initial JWT is now pulled from the URL, and persisted in a cookie.  This
allows the page to be refreshed, without breaking the authentication session.

* If an Organization context is specified, the ID Site model is now requested
from the Organization, rather than the parent application.

To support these features, the [Stormpath.js][] dependency has been updated to
0.6.0.

## 0.3.0

Adding SAML support. The ID Site model is used to provide the SAML providers and
we render buttons for them in the right side bar, along the social providers.

## 0.2.4

Password reset callback will redirect the user to the callback URL if there is
an error during submission.

## 0.2.3

An error message is now shown if email or password is omitted on login form.

## 0.2.2

Upgrade to stormpath.js@0.4.0, better error handling and better error messages.

With this release, ID Site timeout errors will redirect the user back to your
callback URL, with an error JWT.

## 0.2.1

Updating Stormpath.js to 0.3.1, to get organization support and base64 fixes.

## 0.2.0

Adding support for Organizations, as configured by the ID Site Builder in the
service provider.

[Stormpath.js]: https://github.com/stormpath/stormpath.js
