#!/bin/sh
# Copies tools/partials/*.html into the marker blocks of every HTML page.
#
#   ./tools/sync-partials.sh
#
# The website does NOT need this script to work — every page is complete,
# static HTML. Use it only when you change the navigation or the footer and
# want that change reflected on all pages without editing each one by hand.
#
# Each page contains blocks like:
#
#   <!-- @partial:header -->   ...generated markup...   <!-- @endpartial -->
#
# Anything between the markers is replaced. The {{base}} token in a partial
# becomes "" for pages in the repository root and "../" for pages one level
# down (careers/).

set -eu

cd "$(dirname "$0")/.."
ROOT=$(pwd)

replace_block() {
	page=$1; name=$2; base=$3
	partial="$ROOT/tools/partials/$name.html"
	[ -f "$partial" ] || { echo "missing partial: $partial" >&2; exit 1; }

	grep -q "@partial:$name" "$page" || return 0

	tmp_partial=$(mktemp)
	sed "s|{{base}}|$base|g" "$partial" > "$tmp_partial"

	tmp_page=$(mktemp)
	awk -v name="$name" -v file="$tmp_partial" '
		$0 ~ "@partial:" name {
			print; skip = 1
			while ((getline line < file) > 0) print line
			close(file)
			next
		}
		skip && /@endpartial/ { skip = 0; print; next }
		skip { next }
		{ print }
	' "$page" > "$tmp_page"

	mv "$tmp_page" "$page"
	rm -f "$tmp_partial"
	echo "  updated $name in ${page#$ROOT/}"
}

for page in ./*.html; do
	[ -e "$page" ] || continue
	replace_block "$page" header ""
	replace_block "$page" footer ""
done

for page in ./careers/*.html; do
	[ -e "$page" ] || continue
	replace_block "$page" header "../"
	replace_block "$page" footer "../"
done

echo "Done."
