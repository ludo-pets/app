   GITLAB_REPO_URL="https://tools.ages.pucrs.br/ludo-pets/app.git"
   GITHUB_REPO_URL="https://github.com/ludo-pets/app.git"
   REPO_NAME="ludo-pets"

   git clone --mirror "$GITLAB_REPO_URL" "$REPO_NAME"

   cd "$REPO_NAME"

   git push --mirror "$GITHUB_REPO_URL"