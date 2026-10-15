import sys

path = sys.argv[1]
source = open(path, encoding='utf-8').read()

text_15 = (
    "        'screens/alerts/index.tsx', // #174 R12: delta sobre la lista medida en H0\n"
    "        'screens/forgot/index.tsx',\n"
)
assert source.count(text_15) == 1
source = source.replace(text_15, (
    "        'screens/alerts/index.tsx', // #174 R12: delta sobre la lista medida en H0\n"
    "        'screens/docs/index.tsx', // #175 R6\n"
    "        'screens/forgot/index.tsx',\n"
))

tracking_title = "      files: ['screens/alerts/index.tsx'], // #174 R12: H0 sin consumidores\n"
assert source.count(tracking_title) == 1
source = source.replace(tracking_title, (
    "      files: [\n"
    "        'screens/alerts/index.tsx', // #174 R12: H0 sin consumidores\n"
    "        'screens/docs/index.tsx', // #175 R5\n"
    "      ],\n"
))

open(path, 'w', encoding='utf-8').write(source)
print('E3-ok')
