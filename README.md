# task-manager-server


## <a id="top"></a>Index
1. [Schema](#schema)
   - [Users](#users)
2. [Endpoints](#endpoints)
   - [Create User](#1-create-user)
   - [Update User](#2-update-user)
     - [Using PATCH](#using-patch)
     - [Using PUT](#using-put)
3. [Method Choice](#method-choice)
4. [Error Handling](#error-handling)

## Schema

### Users
- **id** (integer, auto-incremented, primary key): Unique identifier for the user.
- **first_name** (string): The user's first name.
- **last_name** (string): The user's last name.
- **description** (string): A brief description about the user.

<br>

**(Back to) - [Top](#top)**

---
<br>
<br>
<br>

## Endpoints

### 1. Create User

- **Method**: `POST`
- **URL**: `/task-manager-data/api/users`
- **Description**: Creates a new user in the database.

**Request Body Example**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "description": "A sample user"
}
```

**Response Example**:

```json
{
  "id": 1
}
```

- Use POST when creating a new user. Provide all required fields in the request body.

<br>

**(< Back to) - [Top](#top)**

---

<br>
<br>
<br>

### 2. Update User
- **Method**: `PATCH` or `PUT`
- **URL**: `/task-manager-data/api/users/:id`
- **Description**: Updates an existing user in the database. 

You can use either PATCH for partial updates or PUT for full updates.

#### Using PATCH
- **Purpose**: Update only specific fields of a user without affecting other fields.

**Request Body Example**:

```json
{
  "first_name": "Jane",
  "description": "Updated user description"
}
```
**Response Example**:

```json
{
  "id": 1,
  "first_name": "Jane",
  "last_name": "Doe",
  "description": "Updated user description"
}
```

- Use PATCH to modify specific fields. Only include the fields you want to update; other fields will remain unchanged.

#### Using PUT
- **Purpose**: Replace the entire user resource. Provide all fields in the request body.


Request Body Example:

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "description": "Completely new user description"
}
```
**Response Example**:

```json
{
  "id": 1,
  "first_name": "Jane",
  "last_name": "Doe",
  "description": "Completely new user description"
}
```
- Use PUT to replace the entire user record. Include all fields in the request body; any missing fields will be reset or removed.

<br>

**(Back to) - [Top](#top)**

---
<br>
<br>
<br>

### Method Choice

#### POST: 
Use this method to create a new user. You must include all required fields in the request body.

#### PATCH: 
Use this method for partial updates. You only need to include the fields you want to update; other fields will stay the same.

#### PUT: 
Use this method to fully replace an existing user. You must provide all fields in the request body, as it will overwrite the existing data.

## Error Handling
- **400 Bad Request**: Returned if the request body is missing required fields or contains invalid data.
- **404 Not Found**: Returned if you attempt to update or delete a user that does not exist.
- **500 Internal Server Error**: Returned if there is a server-side error.

<br>

**(Back to) - [Top](#top)**

--
<br>
<br>
<br>