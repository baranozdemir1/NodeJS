#!/bin/bash

echo "Enter commit message: "
read message

echo "Enter branch name: "
read branch

git add .
git commit -m "$message"
git push -u origin $branch
