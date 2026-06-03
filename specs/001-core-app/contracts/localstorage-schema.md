# Contract: localStorage Schema

**Version**: 1.0.0 | **Defined in**: spec 001-core-app

## Keys

| Key | Type | Description |
|-----|------|-------------|
| `sbpp-favourites` | `BuzzPhrase[]` (JSON array) | Saved phrases, reverse-chronological order |
| `sbpp-mode` | `Mode` (raw string) | Last selected mode |
| `sbpp-theme` | `Theme` (raw string) | Last selected theme |

---

## `sbpp-favourites`

JSON-serialised array of `BuzzPhrase` objects. Each element MUST have `savedAt` populated (Unix milliseconds).

**Example**:
```json
[
  {
    "id": "original-257",
    "words": ["systemised", "logistical", "projection"],
    "indices": [2, 5, 7],
    "mode": "original",
    "savedAt": 1748908800000
  },
  {
    "id": "chaos-034",
    "words": ["integrated", "cloud-native", "mobility"],
    "indices": [0, 3, 4],
    "mode": "chaos",
    "savedAt": 1748905200000
  }
]
```

**Constraints**:
- Maximum 50 entries. When the limit is exceeded, remove the entry with the lowest `savedAt` before prepending the new one.
- `id` is the deduplication key. Re-saving an existing phrase removes the old entry and prepends a fresh entry with an updated `savedAt`.
- Entries are stored in reverse-chronological order (highest `savedAt` first) — the display order matches storage order.
- On read: if JSON parsing fails (corrupted storage), return an empty array and do not throw.
- On write: wrap `localStorage.setItem` in `try/catch`; silently ignore quota errors.

---

## `sbpp-mode`

Raw string matching the `Mode` union: `"original"`, `"modern"`, or `"chaos"`.

**On read**: If the stored value is absent or not a valid `Mode` string, default to `"original"`.

---

## `sbpp-theme`

Raw string matching the `Theme` union: `"splitflap"`, `"slotmachine"`, or `"dotmatrix"`.

**On read**: If the stored value is absent or not a valid `Theme` string, default to `"splitflap"`.
