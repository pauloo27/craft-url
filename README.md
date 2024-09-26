# craft-url

A lightweight, intuitive, TypeScript first, library for safe URL crafting
using template strings.

## Features

- Easy-to-use syntax with ES6 template literals
- Automatic encoding of path and query parameters
- Support for raw (unencoded) values
- Works with both relative and absolute URLs
- Zero dependencies

## Usage

```js
import { urlify, raw } from "craft-url";

// Basic usage
const username = "john doe";
const encodedUri = urlify`/users/${username}`;
console.log(encodedUri); // Output: "/users/john%20doe"

// Query parameters
const filter = "active&new";
const encodedUriWithQuery = urlify`/users?filter=${filter}`;
console.log(encodedUriWithQuery); // Output: "/users?filter=active%26new"

// Using raw values
const baseUrl = "https://api.example.com";
const encodedUriWithRaw = urlify`${raw(baseUrl)}/users/${username}`;
console.log(encodedUriWithRaw); // Output: "https://api.example.com/users/john%20doe"

// Even for database connection strings
const host = "localhost";
const user = "user";
const password = "p@ass/word";
const connStr = urlify`postgresql://${user}:${password}@${host}`;
console.log(connStr); // Output: "postgresql://user:p%40ass%2Fword@localhost"
```

## API

### `urlify`

A tagged template function that safely encodes URI components.

```javascript
urlify`/path/${param}?query=${queryParam}`;
```

### `raw`

A function to wrap values that should not be encoded.

```javascript
raw(value);
```

## License

[MIT](./LICENSE)
