#!/usr/bin/env bash
# 싱귤래리티 시티 로컬 서버 실행 스크립트
#   ./start_server.sh          → http://localhost:8004
#   ./start_server.sh 8080     → 포트 지정
set -euo pipefail
cd "$(dirname "$0")"
exec python3 serve.py "${1:-8004}"
