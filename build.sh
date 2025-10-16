#!/bin/bash
docker buildx build --platform linux/amd64 -t git.lionx.me/innovation/athar-register:latest --push .
