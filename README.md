Head over to [time-rs.github.io/format-converter](https://time-rs.github.io/format-converter)
to use this. It will convert a formatting string that was valid in time v0.1 to
one that has the same behavior in v0.2.

Differences that this tool cannot account for:

- `%Z` has been removed entirely. As it only handled `GMT` and `UTC`, `GMT` will
  be output.
- `%z` could previously parse offsets containing a colon, but does not in v0.2.

All other formatting strings should work identically after being converted.
