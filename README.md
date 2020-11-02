# stash-filestorage

![Tests](https://github.com/JosephusPaye/stash-filestorage/workflows/Tests/badge.svg)

🗃 Simple file-based cache storage for [@josephuspaye/stash](https://github.com/JosephusPaye/stash). This package provides a file storage backend for use in Node.js v10 or above.

This project is part of [#CreateWeekly](https://twitter.com/JosephusPaye/status/1214853295023411200), my attempt to create something new publicly every week in 2020.

## Installation

```
npm install @josephuspaye/stash-filestorage --save
```

## Usage

The following example shows how to use the file storage backend with Stash:

```js
import { Stash } from '@josephuspaye/stash';
import { FileStorage } from '@josephuspaye/stash-filestorage';

const stash = new Stash(
  new FileStorage({
    // Speeds up read operations by keeping a copy of the cache in memory
    // set to `false` to disable (not recommended)
    bufferInMemory: true,
    filePath: path.join(__dirname, 'cache.data'),
  })
);

// use `stash` as normal...
```

## API

### `FileStorage` class

A file-based storage backend for the cache.

Cache data is serialized using [devalue](https://github.com/Rich-Harris/devalue) and written to file for persistence, using Node's `fs` APIs. That means it correctly handles:

- cyclical references (`obj.self = obj`)
- repeated references (`[value, value]`)
- `undefined`, `Infinity`, `NaN`, `-0`
- regular expressions
- dates
- `Map` and `Set`

## Licence

[MIT](LICENCE)
