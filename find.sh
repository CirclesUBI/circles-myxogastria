#!/bin/bash

# Directory to search
search_dir="$1"

# Temporary file for results
temp_file="imports_found.txt"

# Clear previous results
> "$temp_file"

# Find all .js files and extract relevant imports from ~/components
find "$search_dir" -name '*.js' | while read -r file; do
  # Grep for import statements that pull from ~/components
  grep -o "import .* from '~/components/.*'" "$file" | while read -r import_line; do
    echo "$file: $import_line" >> "$temp_file"
  done
done

# Output the results
cat "$temp_file"
