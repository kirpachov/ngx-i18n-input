## Angular inside docker


## Create isolated environment
You need only
- scripts/run-docker.sh
- Dockerfile


```bash
./scripts/run-docker.sh

ng new ngx-i18n-input-workspace --no-create-application --package-manager=npm --directory=. --style=scss --skip-git --no-interactive

ng g library ngx-i18n-input
```