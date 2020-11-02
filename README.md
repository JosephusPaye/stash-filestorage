# stash-filestorage

![Tests](https://github.com/JosephusPaye/stash-filestorage/workflows/Tests/badge.svg)

🗃 Simple file-based cache storage for [@josephuspaye/stash](https://github.com/JosephusPaye/stash).

This project is part of [#CreateWeekly](https://twitter.com/JosephusPaye/status/1214853295023411200), my attempt to create something new publicly every week in 2020.

## Installation

```
npm install @josephuspaye/stash-filestorage --save
```

## How it works

This package provides a file storage backend for [@josephuspaye/stash](https://github.com/JosephusPaye/stash), for use in Node.js.

Cache data is serialized using [devalue](https://github.com/Rich-Harris/devalue) and written to file for persistence.

## Usage

The following example shows how to use the file storage backend with Stash:

<details>
<summary>View example</summary>

```js
import { Stash } from '@josephuspaye/stash';
import { FileStorage } from '@josephuspaye/stash-filestorage';

const stash = new Stash(
  new FileStorage({
    bufferInMemory: true, // Speeds up read operations by keeping a copy of the cache in memory
    // set to `false` to disable (not recommended)
    filePath: path.join(__dirname, 'cache.data'),
  })
);

// use `stash` as normal...
```

</details>

## API

### `FileStorage` class

A file-based storage backend for the cache. Cache data is serialized using [devalue](https://github.com/Rich-Harris/devalue) and written to file for persistence, using Node `fs` APIs.

[MIT](LICENCE)
