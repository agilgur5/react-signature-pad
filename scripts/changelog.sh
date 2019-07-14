# prints the latest changelog

echo '';

echo '## Release';
echo '';
# print the latest commit message
git log --format=%B -n 1 @;

echo '';

echo '## Changelog';
echo '';
# print commit log until previous tag
npx changelog-maker;

echo '';

# get the two latest tags
latest_tag="$(git describe --abbrev=0 --tags)";
prev_tag="$(git describe --abbrev=0 --tags $(git rev-list --tags --skip=1 --max-count=1))"
# print markdown for a GitHub comparison between them
echo "[$prev_tag...$latest_tag](https://github.com/agilgur5/react-signature-canvas/compare/$prev_tag...$latest_tag)"

echo '';
