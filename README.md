# Racky

## Install

You need to have `node` and `pnpm` installed on your machine.
You can install `pnpm` with `npm` by running `npm install -g pnpm`.
Then you can install the dependencies with the following command:

```bash
pnpm install
```

## Tests

You can run the tests with the following command:

```bash
pnpm test
```

or `cd` into the `server` directory and run `pnpm test` from there.

```bash
cd apps/server
pnpm test
```

Test files for the `test` class are located under:

```
apps/
  - server/
    - src/
      - auth/clerk-auth.service.spec.ts           - [ KOPENKIN DMITRII ]
      - business/
        - media/s3.service.spec.ts             - [ KOPENKIN DMITRII ]
        - item/item.service.spec.ts               - [ ARNAL THEO       ]
        - reservation/reservation.service.spec.ts - [ CLEMENT LLORENS  ]
```

Explanations on why we use mocks are located in the comments next to the usage of the mocks in their respective test file.

PS [Dmitrii KOPENKIN]: I have less than 20 tests written, however, I believe that the tests I have written are of good quality and cover the most important parts of the code. I have also written a lot of mocks to test the code in isolation.
