#!/bin/bash

## Init

function_name=""
with_prisma=0

# Parse arguments
while getopts 'pf:' flag; do
  case "${flag}" in
  p) with_prisma=1 ;;
  f) function_name="${OPTARG}" ;;
  esac
done

root_folder=$(pwd)
temp_folder="$root_folder/.temp"
dist_folder="$root_folder/dist"
function_folder="$dist_folder/$function_name"
function_file="$function_folder/function.js"
output_zip="$root_folder/zips/$function_name.zip"
project_name=$(cat package.json | jq -r '.name')

prisma_client_folder="$root_folder/functions/client"
prisma_function_folder="$function_folder/client"

## Script

# Test if the function name is empty
if [ -z "$function_name" ]; then
  echo "Function name is required"
  exit 1
fi

# Test if the function exists
if [ -f "$function_file" ]; then
  echo "Function \"$function_file\" exists already. Re-building..."
  rm -rf "$function_folder"
else
  echo "Function \"$function_file\" does not exist. Creating..."
fi

# Build functions
pnpm run build

if [ $with_prisma -eq 1 ]; then
  # Generate Prisma Client
  echo "Generating PrismaClient..."
  pnpm prisma generate

  # Link the prisma client to the function folder
  if [ -L "$prisma_function_folder" ]; then
    unlink $prisma_function_folder
  fi
  ln -s $prisma_client_folder $prisma_function_folder

  # Update imports in the function file
  sed -i -e 's/..\/client/.\/client/g' $function_folder/prisma.js

  # Remove darwin files
  find "$prisma_function_folder/" -name "*darwin*" -type f -delete
else
  echo "Skipping PrismaClient generation... Run the script with -p to generate PrismaClient"
fi

# Delete installed dependencies
rm -rf $root_folder/node_modules

# Install only production dependencies -- We have to use npm, AWS Lambda doesn't resolve pnpm-installed pkgs correctly
npm install --omit=dev

# Symlink the node_modules directory
ln -s $root_folder/node_modules/ $function_folder/node_modules

# Remove the existing zip file
rm -f $output_zip

# Change to the function folder
cd $function_folder

# Rename the function.js file to index.js
cp function.js index.js

# Zip the function
zip_command="zip -r \"$output_zip\" \".\""
echo Running "$zip_command"
eval $zip_command

## Clean up
# Undo the renaming of the function.js file
rm index.js

# Change back to the root folder
cd $root_folder

# Remove the node_modules symlink
unlink $function_folder/node_modules

# Remove the temp folder
rm -rf $temp_folder

# Delete installed dependencies
rm -rf $root_folder/node_modules

# Delete auto-generated package-lock.json
rm -f $root_folder/package-lock.json

# Install all dependencies
pnpm install
