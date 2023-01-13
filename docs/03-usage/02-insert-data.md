# Insert data

Whenever we create a database with Lyra, we must specify a `schema`, which
represents the entry we are going to insert.

Let's say our database and schema look like this:

```javascript
import { create, insert } from "@lyrasearch/lyra";

const movieDB = await create({
  schema: {
    title: "string",
    director: "string",
    plot: "string",
    year: "number",
    isFavorite: "boolean",
  },
});
```

:::info
Notice that we are now also importing the `insert` method to do our insertions.
:::

## Insert

Data insertion in Lyra is quick and intuitive:

```javascript
const { id: thePrestige } = await insert(movieDB, {
  title: "The prestige",
  director: "Christopher Nolan",
  plot:
    "Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.",
  year: 2006,
  isFavorite: true,
});

const { id: bigFish } = await insert(movieDB, {
  title: "Big Fish",
  director: "Tim Burton",
  plot:
    "Will Bloom returns home to care for his dying father, who had a penchant for telling unbelievable stories. After he passes away, Will tries to find out if his tales were really true.",
  year: 2004,
  isFavorite: true,
});

const { id: harryPotter } = await insert(movieDB, {
  title: "Harry Potter and the Philosopher's Stone",
  director: "Chris Columbus",
  plot:
    "Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.",
  year: 2001,
  isFavorite: false,
});
```

## Batch insertion[​](https://docs.lyrasearch.io/usage/insert-data#batch-insertion)

Most of the `insert` function internals are synchronous, so inserting a large
number of documents in a loop could potentially block the event loop. If you
have a lot of records, we suggest using the `insertBatch` function.

You can pass a third, optional, parameter to change the batch size (default:
`1000`). We recommend keeping this number as low as possible to avoid blocking
the event loop. The `batchSize` refers to the maximum number of `insert`
operations to perform before yielding the event loop.

```javascript
const docs = [
  {
    title: "The prestige",
    director: "Christopher Nolan",
    plot:
      "Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.",
    year: 2006,
    isFavorite: true,
  },
  {
    title: "Big Fish",
    director: "Tim Burton",
    plot:
      "Will Bloom returns home to care for his dying father, who had a penchant for telling unbelievable stories. After he passes away, Will tries to find out if his tales were really true.",
    year: 2004,
    isFavorite: true,
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    director: "Chris Columbus",
    plot:
      "Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.",
    year: 2001,
    isFavorite: false,
  },
];

await insertBatch(movieDB, docs, { batchSize: 500 });
```

## Unsearchable fields

When working on large datasets, it is common to have documents with a large
number of properties, and maybe some of them are not even relevant for any
search purpose.

Also, consider that currently Lyra, including `v0.3.0`, only performs search
operations on strings.

With that being said, let's consider the following schema:

```javascript
import { create } from "@lyrasearch/lyra";

const db = await create({
  schema: {
    author: "string",
    quote: "string",
    favorite: "boolean", // <-- unsearchable
    tags: "string[]", // <-- unsupported type!
  },
});
```

Why does Lyra need to know that a given property is of a certain type if is not
searchable?

The main reason for Lyra to know types is because we're experimenting with the
possibility of performing filtering operations depending on booleans, numbers,
etc.

Starting from `v0.3.0`, it is no longer be necessary to list any non-searchable
property as part of the Lyra schema.

In fact, it is possible to rewrite the schema definition above as follows:

```javascript
import { create } from "@lyrasearch/lyra";

const db = await create({
  schema: {
    author: "string",
    quote: "string",
  },
});
```

and still, be able to insert documents like:

```javascript
{
  "author": "Rumi",
  "quote": "Patience is the key to joy",
  "isFavorite": true,
  "tags": ["inspirational", "deep"]
}
```

or even documents with different shapes:

```javascript
[
  {
    author: "Rumi",
    quote: "Patience is the key to joy",
    isFavorite: true,
    tags: ["inspirational", "deep"],
  },
  {
    author: "Rumi",
    quote: "Grace comes to forgive and then forgive again",
    score: 10,
    link: null,
  },
];
```

of course, it will only be possible to perform search operations on **known
properties**, in that case, `author` and `quote`, which will always need to be
of type `string` (as stated during the schema definition).

## Custom document IDs

Starting from `v0.4.0`, Lyra automatically uses the `id` field of the document ad `id`, if found.

That means that given the following document and schema:

```js
import { create, search } from "@lyrasearch/lyra";

const db = await create({
  schema: {
    id: "string",
    author: "string",
    quote: "string",
  },
});

await insert(db, {
  id: "73cbcc79-2203-49b8-bb52-60d8e9a66c5f",
  author: "Fernando Pessoa",
  quote: "I wasn't meant for reality, but life came and found me"
});
```

the document will be indexed with the following `id`: `73cbcc79-2203-49b8-bb52-60d8e9a66c5f`.

:::info default ID
If the `id` field is not found, Lyra will generate a random `id` for the document.
:::

You can always set a custom ID programmatically by using the `insert` configuration object:

```js
const myDocument = {
  id: "73cbcc79-2203-49b8-bb52-60d8e9a66c5f",
  author: "Fernando Pessoa",
  quote: "I wasn't meant for reality, but life came and found me"
}

const insertConfig = {
  id: (doc /* the full document */) => {
    return author.toLowerCase().replace(/\s/g, "-");
  }
}

await insert(db, myDocument, insertConfig);
```

in that case, the document will be indexed with the following `id`: `fernando-pessoa`.

:::warning duplicate IDs
If you try to insert two documents with the same ID, Lyra will throw an error.
:::