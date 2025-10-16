#!/bin/bash
docker buildx build --platform linux/arm64 -t git.lionx.me/innovation/athar-register:latest --push .
