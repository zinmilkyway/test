#!/bin/sh
branch_name=$(git symbolic-ref HEAD | sed -e 's,.*/,,')
current_user=$(git config user.email)
# if [ "$branch_name" = "main" ] && [ "$current_user" != "thanhhd@aladintech.vn" ]; then
#   echo "Committing to the main branch is not allowed for user '$current_user'."
#   exit 1
# fi