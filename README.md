# Automate Fly.io app deployment

This action wraps the [Fly.io CLI](https://github.com/superfly/flyctl). Use it to deploy or manage your Fly.io application via [Github Actions events](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows).
## Usage for Deployment

> <picture>
>   <source media="(prefers-color-scheme: light)" srcset="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/light-theme/tip.svg">
>   <img alt="Tip" src="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/dark-theme/tip.svg">
> </picture><br>
>
> For production deployments, [pin flyctl to a specific version][pinning] to avoid unexpected behavior in edge releases.

[pinning]: #pin-to-a-specific-version-of-flyctl

```yaml
name: Deploy to Fly
on: [push]
jobs:
  deploy:
    name: Deploy proxy
    runs-on: ubuntu-latest
    steps:
      # This step checks out a copy of your repository.
      - uses: actions/checkout@v2
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Pin to a specific version of `flyctl`:

```yaml
- uses: superfly/flyctl-actions/setup-flyctl@master
  with:
    version: 0.0.462
```
### Running one-off scripts

```yaml
name: Run on Fly
on: [push]
jobs:
  deploy:
    name: Run script
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: "flyctl ssh console --command 'sh ./myscript.sh'"
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

See the [flyctl](https://github.com/superfly/flyctl) GitHub project for more information on using `flyctl`.

## Secrets

`FLY_API_TOKEN` - **Required**. The token to use for authentication. You can find a token by running `flyctl tokens create` or going to your [user settings on fly.io](https://fly.io/user/personal_access_tokens).

## Using the `setup-flyctl` action

This documentation only covers usage of the `setup-flyctl` action. The main action in this repository runs more slowly inside Docker, so is not recommended. It's been kept in place since many CI pipelines are still using it.
