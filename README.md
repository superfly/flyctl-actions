# GitHub Actions for flyctl

This action wraps the flyctl CLI tool to allow deploying and managing fly apps.

## Usage

```yaml
name: Deploy to Fly
on: [push]
jobs:
  deploy:
    name: Deploy proxy
    runs-on: ubuntu-latest
    steps:
      - uses: superfly/flyctl-actions@master
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
        with:
          args: "deploy"
```

See the [flyctl](github.com/superfly/flyctl) GitHub project for more information on using `flyctl`.

## Secrets

`FLY_API_TOKEN` - **Required**. The token to use for authentication. You can find a token by running `flyctl auth token` or going to your [user settings on fly.io](https://fly.io/user/personal_access_tokens).

