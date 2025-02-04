# Izzup Data Structure

Simple flatfiles are used for the core Izzup data, this allows for simple and inexpensive distribution via static web hosting services.

## Base `izzup` directory

An `izzup` directory is created at the root of Electron's `appData` directory.

A `IzzupManifest.json` is written to the directory.

## IzzupManifest Properties

### Accounts

The `accounts` property is an array suitable for loading into a JavaScript Map data structure. The key will be the full account handle, in email format of `memberNick` `@` `izzup.world`.

The value will be meta info regarding the account.

#### Account Meta Info

* Creation timestamp
* Description and avatar pulled from twtxt.txt
* Number of posts (including "previous" twtxt.txt files)
* Number of followed feeds
* Most recent twt post w/ date
* Account status (Izzup members only)
