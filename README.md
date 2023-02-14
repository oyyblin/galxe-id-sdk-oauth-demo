# galxe-id-sdk-oauth-demo

This repo demostrates the ability to integrate with Galxe ID SDK via OAuth.

For more information, see [Galxe documentation](https://docs.galxe.com/developer/integration/galxe-id-sdk/).

## Components of this Demo

The following components are hosted on AWS

### API Gateway

I used a simple setup that integrates `/` and `/oauth/callback` routes with Lambda.

### Lambda

`index.js`: Lambda handler.

There are 3 environment variables:

- CLIENT_ID: Provided by Galxe for your application.
- CLIENT_SECRET: Provided by Galxe for your application.
- WEB_URL: Base URL for the demo website.
