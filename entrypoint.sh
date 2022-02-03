#!/bin/sh -l

if [ -n "$FLY_PROJECT_PATH" ]; then
  PREV_PATH=$(pwd)
  # Allow user to change directories in which to run Fly commands
  cd "$FLY_PROJECT_PATH" || exit
fi


# Default to deploying with a remote builder unless local is specified explicitly
STRATEGY="--remote-only"

for i in "$*" ; do
  if [[ $i == "--local-only" ]] ; then
    STRATEGY="--local-only"
    break
  fi
done

if [[ "$*" != *"deploy"* ]] ; then
  # Strategy only relevant to deployments
  STRATEGY=""
  break
fi

sh -c "flyctl $* $STRATEGY"

ACTUAL_EXIT="$?"

if [ -n "$PREV_PATH" ]; then
  # If we changed directories before, we should go back to where we were.
  cd "$PREV_PATH" || exit
fi

exit $ACTUAL_EXIT
