IGAD BACKEND was built from the ground-up with a Django and Django Rest Framework this makes it easy for developers and sysadmins to automate and consume the APIS.

These docs describes how to use the [IGAD Account](https://data2.repan.info) API. We hope you enjoy these docs, and please don't hesitate to file an issue if you see anything missing.

## User Management

The user management is done with the combination of two (2) platforms

1. [Keycloak](https://keycloak.org/) for the single sign on
2. [Django](https://www.django-rest-framework.org/) for building rest services that integrate and communicate with Keycloak

### Endpoints:

Base URL: https://data2.repan.info/api

Create User:

```
POST: /account/user
```

```
Request Body
```

```javascript
{
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john.doe@mail.com",
    "enabled": true
}
```

Create user Response

```javascript
{
    "message": "User created successfully",
    "user": {
        "id": "ba20d740-766f-4833-bc2a-73bbdc0b9355"
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe",
        "email": "john.doe@mail.com",
        "enabled": true
    }
}
```

Get all users

`GET: /account/users`

```javascript
[
    {
        "id": "ba20d740-766f-4833-bc2a-73bbdc0b9355",
        "createdTimestamp": 1683300192031,
        "username": "airflow",
        "enabled": true,
        "totp": false,
        "emailVerified": false,
        "firstName": "Airflow",
        "lastName": "RePan",
        "disableableCredentialTypes":[],
        "requiredActions":[],
        "notBefore": 0,
        "access":{
            "manageGroupMembership": true, "view": true, "mapRoles": true, "impersonate": true, "manage": true…
        }
    }
]
```

Get a user

`GET: /account/user/{id}`

```javascript
    {
        "id": "ba20d740-766f-4833-bc2a-73bbdc0b9355",
        "createdTimestamp": 1683300192031,
        "username": "airflow",
        "enabled": true,
        "totp": false,
        "emailVerified": false,
        "firstName": "Airflow",
        "lastName": "RePan",
        "disableableCredentialTypes":[],
        "requiredActions":[],
        "notBefore": 0,
        "access":{
            "manageGroupMembership": true, "view": true, "mapRoles": true, "impersonate": true, "manage": true…
        }
    }
```

Delete a user

`DELETE: /account/user/{id}/delete`

```javascript
    {
         "message": "User successfully deleted"
    }
```

Update a user

`PUT: /account/user/{id}/update`
```javascript
    {
        "message": "User details updated successfully"
    }
```
